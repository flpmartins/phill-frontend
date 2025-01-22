import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
} from '@mui/material'

import { BaseLayoutPage } from '../../shared/layouts/BaseLayoutPage'

export const Dashboard: React.FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()

  const cards = [
    {
      title: 'Cadastrar um Produto',
      description: 'Adicione novos produtos ao sistema.',
      buttonText: 'Cadastrar',
      onClick: () => navigate('/list-product'),
    },
    {
      title: 'Lista de Produtos Cadastrados',
      description: 'Veja todos os produtos cadastrados.',
      buttonText: 'Ver Produtos',
      onClick: () => navigate('/list-products'),
    },
    {
      title: 'Alterar Dados de Perfil',
      description: 'Atualize suas informações de perfil.',
      buttonText: 'Alterar Perfil',
      onClick: () => navigate('/profile'),
    },
  ]

  return (
    <BaseLayoutPage title="Dashboard" subTitle="Bem-vindo!">
      <Grid container spacing={4}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[3],
                border: '1px solid #e0e0e0',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.01)',
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textPrimary"
                  sx={{
                    marginBottom: '16px',
                  }}
                >
                  {card.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={card.onClick}
                >
                  {card.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </BaseLayoutPage>
  )
}
