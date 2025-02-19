import { useState } from 'react';
import { Folder, XCircle, CheckCircle, Search, Copy, Check } from 'lucide-react';
import {Alert, AlertDescription} from './ui/alert';

const SCSSAnalyzer = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [excludedPrefixes, setExcludedPrefixes] = useState(['dx-']);
  const [newPrefix, setNewPrefix] = useState('');
  const [searchClass, setSearchClass] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchedFiles, setSearchedFiles] = useState([]);
  const [checkedClasses, setCheckedClasses] = useState(new Set());
  const [copiedClass, setCopiedClass] = useState(null);

  const copyToClipboard = async (className, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(className);
      setCopiedClass(className);
      setTimeout(() => setCopiedClass(null), 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  const handleAddPrefix = (e) => {
    e.preventDefault();
    if (newPrefix && !excludedPrefixes.includes(newPrefix)) {
      setExcludedPrefixes([...excludedPrefixes, newPrefix]);
      setNewPrefix('');
    }
  };

  const handleRemovePrefix = (prefixToRemove) => {
    setExcludedPrefixes(excludedPrefixes.filter(prefix => prefix !== prefixToRemove));
  };

  const filterUnusedClasses = (unusedClasses) => {
    return unusedClasses.filter(className => 
      !excludedPrefixes.some(prefix => className.startsWith(prefix))
    );
  };

  const toggleClassCheck = (className) => {
    const newCheckedClasses = new Set(checkedClasses);
    if (newCheckedClasses.has(className)) {
      newCheckedClasses.delete(className);
    } else {
      newCheckedClasses.add(className);
    }
    setCheckedClasses(newCheckedClasses);
  };

  const searchClassInFiles = async (files, classToSearch) => {
    setAnalyzing(true);
    setError(null);
    const filesWithClass = new Set();
    let classFound = false;

    try {
      for (const file of files) {
        if (file.name.endsWith('.scss')) continue;
        
        const content = await file.text();
        if (content.includes(classToSearch)) {
          classFound = true;
          filesWithClass.add(file.name);
        }
      }

      setSearchResults({
        classFound,
        filesCount: filesWithClass.size,
        className: classToSearch
      });
      setSearchedFiles([...filesWithClass]);

    } catch (err) {
      setError('Error al buscar la clase: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeFiles = async (files) => {
    setAnalyzing(true);
    setError(null);
    
    try {
      const scssClasses = new Set();
      const usedClasses = new Set();
      const allContent = new Map();
      
      // Primero analizamos los archivos SCSS
      for (const file of files) {
        const content = await file.text();
        allContent.set(file.name, content);
        
        if (file.name.endsWith('.scss')) {
          // Buscar definiciones de clases
          const classRegex = /\.([a-zA-Z][a-zA-Z0-9_-]*)\s*[{,]/g;
          let match;
          while ((match = classRegex.exec(content)) !== null) {
            const className = match[1];
            scssClasses.add(className);
            
            // Buscar si la clase se usa en @extend o en el mismo archivo
            const reuseRegex = new RegExp(`(@extend\\s+\\.${className}|\\$${className}|\\@include\\s+${className}|class=['"].*?${className}.*?['"])`, 'g');
            if (content.match(reuseRegex)) {
              usedClasses.add(className);
            }
          }
        }
      }

      // Buscar uso de clases en archivos no SCSS
      for (const scssClass of scssClasses) {
        if (!usedClasses.has(scssClass)) { // Solo buscar si no está ya marcada como usada
          for (const [fileName, content] of allContent) {
            if (fileName.endsWith('.scss')) continue;

            // Si el string de la clase aparece en cualquier parte del archivo
            if (content.includes(scssClass)) {
              usedClasses.add(scssClass);
              break;
            }
          }
        }
      }
      
      // Calcular clases no utilizadas
      const allUnusedClasses = [...scssClasses].filter(x => !usedClasses.has(x));
      const filteredUnusedClasses = filterUnusedClasses(allUnusedClasses);
      
      setResults({
        totalClasses: scssClasses.size,
        usedClasses: usedClasses.size,
        unusedClasses: filteredUnusedClasses,
        unusedClassesCount: filteredUnusedClasses.length,
        allUnusedClassesCount: allUnusedClasses.length,
        usagePercentage: ((usedClasses.size / scssClasses.size) * 100).toFixed(2)
      });

      setCheckedClasses(new Set());
    } catch (err) {
      setError('Error al analizar los archivos: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchClass && window.lastUploadedFiles) {
      searchClassInFiles(window.lastUploadedFiles, searchClass);
    } else {
      setError('Por favor, primero sube los archivos del proyecto y luego ingresa una clase para buscar.');
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const items = e.dataTransfer.items;
    const files = [];
    
    async function traverseFileSystem(entry) {
      // Ignorar la carpeta node_modules
      if (entry.name === 'node_modules') {
        return;
      }

      if (entry.isFile) {
        const file = await new Promise((resolve) => entry.file(resolve));
        if (file.name.endsWith('.scss') || 
            file.name.endsWith('.jsx') || 
            file.name.endsWith('.tsx') || 
            file.name.endsWith('.js') ||
            file.name.endsWith('.ts') ||
            file.name.endsWith('.html')) {
          files.push(file);
        }
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const entries = await new Promise((resolve) => {
          reader.readEntries(resolve);
        });
        await Promise.all(entries.map(entry => traverseFileSystem(entry)));
      }
    }
    
    for (const item of items) {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        await traverseFileSystem(entry);
      }
    }
    
    if (files.length > 0) {
      window.lastUploadedFiles = files;
      analyzeFiles(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="scss-analyzer">
      <div className="container">
        <h1>Analizador de Clases SCSS</h1>
        
        {/* Sección de prefijos excluidos */}
        <div className="card excluded-prefixes">
          <div className='inside-card'>
          <h3>Prefijos Excluidos</h3>
          <div className="input-group">
            <input
              type="text"
              value={newPrefix}
              onChange={(e) => setNewPrefix(e.target.value)}
              placeholder="Añadir prefijo (ej: dx-)"
            />
            <button
              onClick={handleAddPrefix}
              className="button-primary"
            >
              Añadir
            </button>
          </div>
          <div className="prefix-tags">
          </div>
            {excludedPrefixes.map(prefix => (
              <div
                key={prefix}
                className="prefix-tag"
              >
                <span>{prefix}</span>
                <button
                  onClick={() => handleRemovePrefix(prefix)}
                  className="remove-prefix"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de búsqueda de clase */}
        <div className="card search-section">
           <div className='inside-card'>
          <h3>Buscar Clase Específica</h3>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchClass}
              onChange={(e) => setSearchClass(e.target.value)}
              placeholder="Nombre de la clase a buscar"
            />
            <button type="submit" className="button-primary">
              <Search className="icon" />
              Buscar
            </button>
          </form>

          {searchResults && (
            <div className="search-results">
              <div className={`result-card ${searchResults.classFound ? 'success' : 'error'}`}>
                <p className="result-message">
                  {searchResults.classFound 
                    ? `La clase "${searchResults.className}" se encontró en ${searchResults.filesCount} archivo(s)` 
                    : `La clase "${searchResults.className}" no se encontró en ningún archivo`}
                </p>
                {searchResults.classFound && searchedFiles.length > 0 && (
                  <div className="files-list">
                    <p>Archivos donde se usa:</p>
                    <ul>
                      {searchedFiles.map((file, index) => (
                        <li key={index}>{file}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Zona de drop */}
        <div 
          className="drop-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Folder className="icon" />
          <p className="primary-text">
            Arrastra y suelta tu carpeta del proyecto aquí
          </p>
          <p className="secondary-text">
            Se analizarán archivos .scss, .jsx, .tsx, .js, .ts y .html
          </p>
        </div>

        {analyzing && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analizando archivos...</p>
          </div>
        )}

        {error && (
          <Alert className="error">
            <XCircle className="icon" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {results && (
          <div className="results">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total de Clases</h3>
                <p className="stat-value">{results.totalClasses}</p>
              </div>
              <div className="stat-card">
                <h3>Clases Utilizadas</h3>
                <p className="stat-value success">{results.usedClasses}</p>
              </div>
              <div className="stat-card">
                <h3>Porcentaje de Uso</h3>
                <p className="stat-value highlight">{results.usagePercentage}%</p>
              </div>
            </div>

            <div className="card unused-classes">
              <h2>
                Clases No Utilizadas ({results.unusedClassesCount})
                {results.allUnusedClassesCount !== results.unusedClassesCount && (
                  <span className="excluded-count">
                    ({results.allUnusedClassesCount - results.unusedClassesCount} clases excluidas por prefijos)
                  </span>
                )}
                <span className="checked-count">
                  Revisadas: {checkedClasses.size} de {results.unusedClassesCount}
                </span>
              </h2>
              {results.unusedClasses.length > 0 ? (
                <div className="classes-list">
                  {results.unusedClasses.map((className) => (
                    <div key={className} className="class-item">
                      <label className="class-label">
                        <input
                          type="checkbox"
                          checked={checkedClasses.has(className)}
                          onChange={() => toggleClassCheck(className)}
                        />
                        <span className="class-name">.{className}</span>
                        <button
                          onClick={(e) => copyToClipboard(className, e)}
                          className="copy-button"
                          title="Copiar al portapapeles"
                        >
                          {copiedClass === className ? (
                            <>
                              <Check className="icon" />
                              <span>Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="icon" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <CheckCircle className="icon success" />
                  <p>¡Todas las clases están siendo utilizadas!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SCSSAnalyzer;