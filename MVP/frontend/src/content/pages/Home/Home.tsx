import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Modal,
  Button,
  TextField
} from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import stylesHome from './stylesHome';
import Navbar from 'src/components/Navbar/SideMenu';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './stylesCalendario.css';
import { ErrorOutline } from '@mui/icons-material';

const Home = () => {
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [abrirModal, setAbrirModal] = useState(false);
  const [lembreteTexto, setLembreteTexto] = useState<string>('');
  const [lembretes, setLembretes] = useState<{ [key: string]: string[] }>({});

  const handleDiaEscolhido = (value: Date) => {
    setDataSelecionada(value);
    setLembreteTexto('');
    setAbrirModal(true);
  };
  const handleFecharModal = () => {
    setAbrirModal(false);
    setLembreteTexto('');
  };
  const handleSalvarLembrete = () => {
    if (dataSelecionada && lembreteTexto.trim() !== '') {
      const key = dataSelecionada.toDateString();
      setLembretes((prev) => ({
        ...prev,
        [key]: prev[key] ? [...prev[key], lembreteTexto] : [lembreteTexto]
      }));
    }
    handleFecharModal();
  };

  const desabilitarDia = ({ date }: { date: Date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <Navbar />
      <Box sx={stylesHome.conteudo}>
        <Box sx={stylesHome.boxCards}>
          <Card sx={stylesHome.cardReceber}>
            <CardContent>
              <Box sx={stylesHome.cardHeader}>
                <Box sx={stylesHome.icon}>
                  <CheckCircleIcon sx={{ color: '#4CAF50' }} />
                </Box>
                <Typography variant="h6" sx={stylesHome.cardTitulo}>
                  A receber
                </Typography>
              </Box>
              <Typography variant="h4">R$ 0,00</Typography>
            </CardContent>
          </Card>
          {/* Card A pagar hoje */}
          <Card sx={stylesHome.cardPagar}>
            <CardContent>
              <Box sx={stylesHome.cardHeader}>
                <Box sx={stylesHome.icon}>
                  <ErrorOutline sx={{ color: 'orange' }} />
                </Box>
                <Typography variant="h6" sx={stylesHome.cardTitulo}>
                  A receber hoje
                </Typography>
              </Box>
              <Typography variant="h4">R$ 0,00</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Paper sx={stylesHome.paper}>
            <Typography variant="h6" sx={stylesHome.calendarioTitulo}>
              Calendário
            </Typography>
            <Calendar
              onClickDay={handleDiaEscolhido}
              locale="pt-BR"
              prevLabel="<"
              nextLabel=">"
              formatShortWeekday={(locale, date) =>
                ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][date.getDay()]
              }
              formatMonthYear={(locale, date) =>
                date.toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long'
                })
              }
              tileDisabled={desabilitarDia}
              tileClassName={({ date, view }) => {
                if (view === 'month') {
                  const key = date.toDateString();
                  if (lembretes[key]?.length > 0) {
                    return 'highlight-day';
                  }
                }
                return '';
              }}
            />
          </Paper>
        </Box>
        <Modal
          open={abrirModal}
          onClose={handleFecharModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={stylesHome.modalStyle}>
            <Typography id="modal-title" variant="h6" component="h2" mb={2}>
              Lembretes do dia
            </Typography>
            <Typography id="modal-description" sx={{ mb: 2 }}>
              Dia selecionado:{' '}
              {dataSelecionada
                ? dataSelecionada.toLocaleDateString('pt-BR')
                : ''}
            </Typography>
            {dataSelecionada &&
            lembretes[dataSelecionada.toDateString()]?.length > 0 ? (
              <ul>
                {lembretes[dataSelecionada.toDateString()].map(
                  (lembrete, index) => (
                    <li key={index}>{lembrete}</li>
                  )
                )}
              </ul>
            ) : (
              <Typography variant="body2" sx={{ mb: 2 }}>
                Nenhum lembrete para este dia.
              </Typography>
            )}
            <TextField
              fullWidth
              label="Novo lembrete"
              value={lembreteTexto}
              onChange={(e) => setLembreteTexto(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box display="flex" justifyContent="space-between">
              <Button variant="contained" onClick={handleSalvarLembrete}>
                Salvar
              </Button>
              <Button variant="outlined" onClick={handleFecharModal}>
                Fechar
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </HelmetProvider>
  );
};

export default Home;
