const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { default: axios } = require('axios');

// Reemplaza con el puerto correcto de tu Arduino (Windows: COM3, Linux/Mac: /dev/ttyUSB0 o similar)
const port = new SerialPort({
  path: 'COM3',
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));


parser.on('data', async (line) => {
  const cleanLine = line.trim();

  // Validar que parece un JSON completo
  if (cleanLine.startsWith("{") && cleanLine.endsWith("}")) {
    try {
      const data = JSON.parse(cleanLine);
      console.log("Datos recibidos:", data);

      await axios.post('http://localhost:3000/api/datos', data);
      console.log("Enviado al servidor.");
    } catch (err) {
      console.error("JSON inválido:", cleanLine);
    }
  } else {
    console.warn("Dato ignorado:", cleanLine);
  }
});