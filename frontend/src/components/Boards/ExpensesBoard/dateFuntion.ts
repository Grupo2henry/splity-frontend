export const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(date);
  };

export default formatDate;  