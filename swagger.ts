import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: { title: 'Desafio AWS API', version: '1.0.0' },
  host: 'localhost:3000',
  tags: [
    { name: 'Health' },
    { name: 'Directors' },
    { name: 'Movies' }
  ],
  components: {
    schemas: {
      DirectorInput: {
        $name: 'Christopher Nolan'
      },
      MovieInput: {
        $title: 'Inception',
        description: 'Um ótimo filme de ficção',
        $releaseYear: 2010,
        $genre: 'Sci-Fi',
        $directorId: 'uuid-aqui'
      }
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['./src/app.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);