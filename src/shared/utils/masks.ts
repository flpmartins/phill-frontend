const formatDocumento = (value: string) => {
  // Remove todos os caracteres não numéricos e limita a 11 ou 14 caracteres
  const cleanedValue = value?.replace(/\D/g, '')
  const isCNPJ = cleanedValue?.length > 11

  // Formata o CNPJ (99.999.999/9999-99) ou o CPF (999.999.999-99)
  const match = cleanedValue?.match(
    isCNPJ
      ? /^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})$/
      : /^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/,
  )

  if (match) {
    const formattedValue = isCNPJ
      ? `${match[1] || ''}${match[2] ? `.${match[2]}` : ''}${
          match[3] ? `.${match[3]}` : ''
        }${match[4] ? `/${match[4]}` : ''}${match[5] ? `-${match[5]}` : ''}`
      : `${match[1] || ''}${match[2] ? `.${match[2]}` : ''}${
          match[3] ? `.${match[3]}` : ''
        }${match[4] ? `-${match[4]}` : ''}`

    return formattedValue
  } else {
    return cleanedValue
  }
}

const formatPlate = (value: string) => {
  // Verifica se o valor é nulo, indefinido ou vazio e retorna uma string vazia se verdadeiro
  if (value == null || value === '') return ''

  // Remove todos os caracteres que não são letras ou números
  const cleanedValue = value.replace(/[^a-zA-Z0-9]/g, '')

  // Converte todas as letras para maiúsculas
  const upperCaseValue = cleanedValue.toUpperCase()

  // Dividindo a lógica de formatação entre a parte alfabética e numérica
  // Permite até 3 caracteres (letras ou números) seguidos de hífen e até 4 caracteres (letras ou números) na parte numérica
  const match = upperCaseValue.match(/^([a-zA-Z0-9]{0,3})([a-zA-Z0-9]{0,4})?$/)

  if (match) {
    return match[2]
      ? `${match[1].slice(0, 3)}-${match[2]}`
      : `${match[1].slice(0, 3)}`
  } else {
    // Caso o valor limpo não esteja no formato esperado, ainda tenta aplicar a máscara da melhor forma possível
    const partialMatch = upperCaseValue.match(/^([a-zA-Z0-9]{0,3})/)
    return partialMatch ? partialMatch[1] : ''
  }
}

const formatRG = (value: string) => {
  if (value == null) return ''

  const cleanedValue = value.toUpperCase().replace(/[^0-9X]/g, '')

  const match = cleanedValue.match(/^(\d{1,2})(\d{0,3})(\d{0,3})([0-9X]?)$/)

  if (match) {
    return `${match[1] || ''}${match[2] ? `.${match[2]}` : ''}${
      match[3] ? `.${match[3]}` : ''
    }${match[4] ? `-${match[4]}` : ''}`
  } else {
    return cleanedValue
  }
}

const formatDataBirth = (value: string) => {
  // Checa se o valor é null ou undefined e retorna uma string vazia
  if (value == null || value === '') return ''

  // Remove todos os caracteres não numéricos
  const cleanedValue = value.replace(/\D/g, '')

  // Limita o valor a 8 caracteres
  const maxLength = 8
  const limitedValue = cleanedValue.substring(0, maxLength)

  // Formata o valor limpo como DD/MM/AAAA
  const parts = []
  if (limitedValue.length > 0) {
    parts.push(limitedValue.substring(0, 2))
  }
  if (limitedValue.length > 2) {
    parts.push(limitedValue.substring(2, 4))
  }
  if (limitedValue.length > 4) {
    parts.push(limitedValue.substring(4, 8))
  }

  return parts.join('/')
}

const formatTelefone = (value: string) => {
  // Remove todos os caracteres não numéricos
  const cleanedValue = value?.replace(/\D/g, '')

  // Verifica se é celular (9 dígitos) ou telefone (8 dígitos)
  const isCelular = cleanedValue?.length === 11
  const match = cleanedValue?.match(
    isCelular
      ? /^(\d{0,2})(\d{0,5})(\d{0,4})$/
      : /^(\d{0,2})(\d{0,4})(\d{0,4})$/,
  )

  if (match) {
    const formattedValue = `${match[1] ? `(${match[1]}` : ''}${
      match[2] ? `) ${match[2]}` : ''
    }${match[3] ? ` ${match[3]}` : ''}`

    return formattedValue
  } else {
    return cleanedValue
  }
}
const formatCEP = (value: string) => {
  const cleanedValue = value?.replace(/\D/g, '')

  const match = cleanedValue?.match(/^(\d{0,5})(\d{0,3})$/)

  if (match) {
    const formattedValue = `${match[1] ? `${match[1]}-` : ''}${
      match[2] ? match[2] : ''
    }`
    return formattedValue
  } else {
    return cleanedValue
  }
}
const formatValorReal = (value: string) => {
  if (value) {
    const cleanedValue = value.replace(/\D/g, '')

    const centavos = cleanedValue.slice(-2)
    const reais = cleanedValue.slice(0, -2)

    const formattedReais = reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

    return `R$ ${formattedReais},${centavos}`
  } else {
    return ''
  }
}
const formatData = (value: string): string => {
  if (value) {
    // Remove todos os caracteres não numéricos
    const cleanedValue = value.replace(/\D/g, '')

    // Se o comprimento é menor que 8, não adiciona a formatação
    if (cleanedValue.length <= 2) {
      return cleanedValue
    } else if (cleanedValue.length <= 4) {
      return `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2)}`
    } else {
      return `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(
        2,
        4,
      )}/${cleanedValue.slice(4, 8)}`
    }
  } else {
    return ''
  }
}

const formatPrice = (value: string) => {
  if (!value) return 'R$ 0,00' // Valor inicial caso vazio

  const cleanedValue = value.replace(/\D/g, '') // Remove qualquer caractere não numérico

  // Preenche com zeros à esquerda se necessário
  const paddedValue = cleanedValue.padStart(3, '0') // Garante pelo menos 3 dígitos (2 para centavos e 1 para reais)

  // Separa reais e centavos
  const reais = paddedValue.slice(0, -2) // Tudo menos os últimos 2 dígitos
  const centavos = paddedValue.slice(-2) // Últimos 2 dígitos

  // Formata o valor com separadores
  const formattedReais = parseInt(reais, 10).toLocaleString('pt-BR') // Remove zeros à esquerda e formata milhares
  return `R$ ${formattedReais},${centavos}`
}

export {
  formatPlate,
  formatDataBirth,
  formatDocumento,
  formatTelefone,
  formatRG,
  formatCEP,
  formatValorReal,
  formatData,
  formatPrice,
}
