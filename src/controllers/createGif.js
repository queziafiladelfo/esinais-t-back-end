const ffmpeg = require('fluent-ffmpeg'); // Importa a biblioteca fluent-ffmpeg para manipulação de vídeo
const { EventEmitter } = require('events'); // Importa a classe EventEmitter para emitir e ouvir eventos
const gm = require('gm'); // Importa a biblioteca GraphicsMagick para manipulação de imagens
const path = require('path'); // Importa a biblioteca path para manipulação de caminhos de arquivos
const fs = require('fs-extra'); // Importa fs-extra para operações de sistema de arquivos com funcionalidades adicionais
const GIFEncoder = require('gifencoder'); // Importa GIFEncoder para criar GIFs a partir de imagens
const { createCanvas, loadImage } = require('canvas'); // Importa createCanvas e loadImage da biblioteca canvas para criar e manipular imagens

const width = 480; // Largura padrão para o GIF
const height = 270; // Altura padrão para o GIF

// Configurações padrão para a criação do GIF
const defaultOptions = {
   frames: 10, // Número de frames que o GIF terá
   size: '360x?', // Tamanho do GIF; '?' manterá a proporção do vídeo original
   delay: 50 // Atraso entre cada frame no GIF em milissegundos
}

// Define a classe GIF que estende EventEmitter para emitir eventos
class GIF extends EventEmitter {
   
   // Método para gerar uma string aleatória de 10 dígitos
   randomString() {
      const randomNums = "0123456789"; // Dígitos possíveis para a string
      var randStr = ""; // String resultante
      for (var i = 0; i < 10; i++) { // Loop para gerar uma string de 10 caracteres
         randStr += randomNums[Math.floor((Math.random() * 10))]; // Adiciona um dígito aleatório
      }
      return randStr; // Retorna a string aleatória
   }

   /**
    * Cria um novo GIF a partir de um vídeo fonte.
    * @param {String} video - Caminho para o vídeo fonte para o novo GIF.
    * @param {String} destination - Destino do novo GIF.
    * @param {String} nomeSinal - Nome do arquivo GIF final.
    * @param {Object} options - Opções para a criação do GIF.
    * @param {Integer} options.frames - Número de frames que o GIF terá.
    * @param {String} options.size - Tamanho do GIF. Ex: '480x?' onde '?' mantém a proporção do vídeo.
    * @param {Integer} options.delay - Atraso entre frames no GIF.
    */
   constructor(video, destination, nomeSinal, options) {
      if (!options) options = defaultOptions; // Se não forem fornecidas opções, usa as opções padrão
      super(); // Chama o construtor da classe pai EventEmitter
      // Cria um diretório temporário para armazenar os frames do GIF
      const tempFolder = path.join(destination.split('/').slice(0, -1).join('/'), 'temp');
      console.log("tempFolder");
      console.log(tempFolder);
      fs.mkdirSync(tempFolder); // Cria o diretório temporário

      // Usa ffmpeg para extrair screenshots do vídeo
      ffmpeg(video).screenshots({
         count: (options.frames || 10), // Número de frames a serem extraídos
         filename: 'temp-%i', // Nome dos arquivos de imagem temporários
         size: (options.size || '360x?'), // Tamanho das imagens
         folder: tempFolder // Diretório onde as imagens serão salvas
      }).on('end', () => { // Quando a extração dos frames for concluída
         var newGif = gm(); // Cria uma nova instância de GraphicsMagick
         var gifFrames = []; // Array para armazenar os caminhos dos frames do GIF

         // Lê todos os arquivos no diretório temporário
         for (var i of fs.readdirSync(tempFolder)) {
            if (i.endsWith('.png')) { // Verifica se o arquivo é uma imagem PNG
               gifFrames.push(path.join(tempFolder, i)); // Adiciona o caminho do frame ao array
               newGif.in(path.join(tempFolder, i)); // Adiciona a imagem ao novo GIF
            }
         }

         // Cria um canvas para desenhar as imagens
         const canvas = createCanvas(width, height);
         const ctx = canvas.getContext('2d');
         const encoder = new GIFEncoder(width, height); // Cria um novo encoder para o GIF

         // Cria um fluxo de escrita para salvar o GIF final
         encoder.createReadStream().pipe(fs.createWriteStream(path.join(destination, nomeSinal)));

         encoder.start(); // Inicia o processo de codificação do GIF
         encoder.setRepeat(0); // Define o GIF para repetir indefinidamente
         encoder.setDelay(options.delay || 50); // Define o atraso entre frames
         encoder.setQuality(10); // Define a qualidade do GIF

         // Lê os arquivos no diretório temporário
         const list = fs.readdirSync(tempFolder);

         // Para cada arquivo, carrega a imagem e adiciona ao GIF
         list.forEach(async (f, i) => {
            const image = await loadImage(path.join(tempFolder, f)); // Carrega a imagem
            ctx.drawImage(image, 0, 0); // Desenha a imagem no canvas
            encoder.addFrame(ctx); // Adiciona o frame ao encoder

            // Quando for o último frame, termina a codificação do GIF
            if (i === list.length - 1) {
               encoder.finish();
            }
         });

         // Remove os arquivos temporários
         for (var i of gifFrames) {
            fs.removeSync(path.join(i));
         }
         fs.rmdirSync(tempFolder); // Remove o diretório temporário
         fs.unlink(video); // Remove o vídeo original

         this.emit('end', {}); // Emite o evento 'end' quando o GIF estiver pronto
      });

      return this; // Retorna a instância da classe GIF
   }
}

module.exports = GIF; // Exporta a classe GIF para uso em outros arquivos
