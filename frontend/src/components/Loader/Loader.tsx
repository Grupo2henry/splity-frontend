import styles from './Loader.module.css'; // Importa los estilos CSS

interface LoaderProps {
  isLoading: boolean;
  message?: string; // Mensaje opcional a mostrar
}

const Loader: React.FC<LoaderProps> = ({ isLoading, message }) => {
  if (!isLoading) {
    return null; // No renderizar si no está cargando
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default Loader;