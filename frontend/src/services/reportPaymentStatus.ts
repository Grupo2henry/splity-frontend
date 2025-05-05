export async function reportPaymentStatus({
    status,
    paymentId,
    preferenceId,
  }: {
    status: string;
    paymentId: string;
    preferenceId: string;
  }) {
    try {
      const response = await fetch("https://loud-chicken-raise.loca.lt/payment/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          paymentId,
          preferenceId,
        }),
      });
      console.log("Este es el response: ", response)
      if (!response.ok) {
        throw new Error("Error al enviar el estado del pago al backend");
      }
  
      return await response.json();
    } catch (error) {
      console.log("Sucedio un error.")
      console.error("Error reportando estado de pago:", error);
    }
  }