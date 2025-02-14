# SCSS Analyzer

SCSS Analyzer es una herramienta web interactiva diseñada para analizar y gestionar clases SCSS en proyectos. Permite identificar clases no utilizadas, realizar búsquedas específicas y gestionar prefijos excluidos.

## 🚀 Características

- **Análisis de Clases SCSS**
  - Identificación de clases no utilizadas
  - Cálculo de porcentajes de uso
  - Estadísticas detalladas

- **Búsqueda Avanzada**
  - Búsqueda de clases específicas
  - Visualización de archivos donde se usa cada clase
  - Resultados en tiempo real

- **Gestión de Prefijos**
  - Exclusión de prefijos específicos
  - Gestión dinámica de la lista de exclusiones
  - Personalización de reglas

- **Interfaz Intuitiva**
  - Drag & drop de archivos
  - Visualización clara de resultados
  - Feedback visual instantáneo

## 🛠️ Tecnologías Utilizadas

- React
- SCSS
- Lucide Icons
- JavaScript ES6+

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/scss-analyzer.git
```

2. Instala las dependencias:
```bash
cd scss-analyzer
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 📦 Estructura del Proyecto

```
scss-analyzer/
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   └── ui/
│   │       ├── alert.jsx
│   │       └── SCSSAnalyzer.jsx
│   ├── App.jsx
│   ├── App.scss
│   └── main.jsx
├── public/
│   └── favicon.png
└── package.json
```

## 🎯 Uso

1. **Inicio de la Aplicación**
   - Abre la aplicación en tu navegador
   - Arrastra y suelta la carpeta de tu proyecto en la zona designada

2. **Gestión de Prefijos**
   - Añade prefijos que deseas excluir del análisis
   - Elimina prefijos de la lista cuando sea necesario

3. **Búsqueda de Clases**
   - Utiliza el buscador para encontrar clases específicas
   - Revisa los archivos donde se utiliza cada clase

4. **Análisis de Resultados**
   - Revisa las estadísticas generales
   - Identifica clases no utilizadas
   - Marca clases revisadas

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## ✨ Funcionalidades Planeadas

- [ ] Soporte para análisis de múltiples proyectos
- [ ] Exportación de reportes en diferentes formatos
- [ ] Integración con sistemas de CI/CD
- [ ] Análisis de dependencias entre clases
- [ ] Sugerencias automáticas de optimización

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- Abre un issue en GitHub
- Envía un email a [tu-email@ejemplo.com]
- Consulta la documentación en [link-a-docs]

## 👥 Autores

- **Stella Esparza Torregrosa**

## 🙏 Agradecimientos

- A todos los contribuidores que han participado en este proyecto
- A la comunidad de desarrolladores por su feedback y sugerencias
- A las librerías y herramientas que hacen este proyecto posible