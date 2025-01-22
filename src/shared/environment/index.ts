export const environment = {
  /**
   * Define o ambiente que está rodando a aplicação
   */
  ENVIRONMENT: process.env.NODE_ENV || 'production',
  /**
   * Define a quantidade de linhas a ser exibido na listagem
   */
  LINE_LIMIT: 6,
  /**
   * Placehover dos campos de pesquisa
   */
  SEARCH_INPUT: process.env.REACT_APP_SEARCH_INPUT || 'Pesquisar...',
  /**
   * Mensagem da lista caso nao tenha registro
   */
  EMPTY_LIST: process.env.REACT_APP_EMPTY_LIST || 'Nenhum registro encontrado',
  /**
   * URL de acesso a api
   */
  BASE_URL: process.env.REACT_APP_BASE_URL || '',

  /**
   * APP Name
   */
  APP_NAME: process.env.REACT_APP_APP_NAME || '@template',
  /**
   * Define o bucket de armazenamento das imagens
   */
  FILE_URL: process.env.REACT_APP_AWS_S3_URL || '',
}
