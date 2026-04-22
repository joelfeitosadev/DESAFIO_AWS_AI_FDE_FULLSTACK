export interface CreateMovieInput {
  title: string;
  description?: string;
  releaseYear: number;
  genre: string;
  directorId: string;
}

export interface MovieFilters {
  title?: string;
  genre?: string;
  releaseYear?: number;
}