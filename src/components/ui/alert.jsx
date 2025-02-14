export const Alert = ({ className, variant = "default", ...props }) => (
  <div
    role="alert"
    className={`alert ${className}`}
    {...props}
  />
);

export const AlertDescription = ({ className, ...props }) => (
  <div
    className={`alert-description ${className}`}
    {...props}
  />
);