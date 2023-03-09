const generarNumerosAleatorios = (n) => {
    const numeros = {};
    for (let i = 0; i < n; i++) {
      const numero = Math.floor(Math.random() * 1000) + 1;
      if (numeros[numero]) {
        numeros[numero]++;
      } else {
        numeros[numero] = 1;
      }
    }
    return numeros;
}

process.on('message', cant => {
    console.log(`Generando ${cant} randoms`)
    process.send(generarNumerosAleatorios(cant))
    process.exit()
})


process.send("Iniciado")