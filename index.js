const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { default: axios } = require('axios');

const port = new SerialPort({
  path: 'COM3',
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));


parser.on('data', async (line) => {
  const cleanLine = line.trim();

  if (cleanLine.startsWith("{") && cleanLine.endsWith("}")) {
    try {
      const data = JSON.parse(cleanLine);
      console.log("Datos recibidos:", data);

      await axios.post('http://[2803:d100:e580:42f:190:8627:5fae:659c]:3000/api/datos', data);
      console.log("Enviado al servidor.");
    } catch (err) {
      console.error("JSON inválido:", cleanLine);
    }
  } else {
    console.warn("Dato ignorado:", cleanLine);
  }
});