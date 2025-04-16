import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography
} from '@mui/material';
import { ExpandLess, ExpandMore, Height } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import  stylesNav  from 'src/components/Navbar/stylesNavBar';

const Navbar: React.FC = () => {
  const [estaAtivo, setEstaAtivo] = useState(false);
  const [subMenuAberto, setSubMenuAberto] = useState<string | null>(null);
  const navigate = useNavigate();
  const Menu = () => {
    setEstaAtivo(!estaAtivo);
  };

  const sideBar = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const menuItem = event.currentTarget.parentElement;
    if (menuItem) {
      menuItem.classList.toggle('submenu-active');
    }
  };

  const mostrarSubmenu = (menu: string) => {
    setSubMenuAberto(subMenuAberto === menu ? null : menu);
  };

  return (
    <>
      <Box sx={stylesNav.navbar}>
        <i
          className="bi bi-list menu-btn"
          onClick={Menu}
          style={{ fontSize: '40px' }}
        ></i>
        <Box sx={stylesNav.logoContainer}>
          <Box
            component="img"
            src="/img/rmenezes.jpg"
            alt="Logo RMENEZES"
            sx={stylesNav.logo}
          />
          <img />
        </Box>
      </Box>

      <Drawer
        anchor="left"
        open={estaAtivo}
        onClose={() => setEstaAtivo(false)}
        sx={stylesNav.sidebar}
      >
        <List sx={stylesNav.sideBarMenu}>
          <ListItem  disablePadding>
            <ListItemButton onClick={() => mostrarSubmenu('clientes')}>
              <ListItemText sx={stylesNav.menuItemTitle} primary="Clientes" />
              {subMenuAberto === 'clientes' ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>

          <Collapse
            in={subMenuAberto === 'clientes'}
            timeout="auto"
            unmountOnExit
          >
            <List disablePadding>
              <ListItemButton sx={stylesNav.listItemButton}
                onClick={() => {
                  setEstaAtivo(false);
                  navigate('/clientes');
                }}
              >
                <ListItemText sx={stylesNav.submenuItem} primary="Ver Clientes" />
              </ListItemButton>

              <ListItemButton sx={stylesNav.listItemButton}
                onClick={() => {
                  setEstaAtivo(false);
                  navigate('/cliente-add');
                }}
              >
                <ListItemText sx={stylesNav.submenuItem} primary="Adicionar Cliente" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItem disablePadding>
            <ListItemButton onClick={() => mostrarSubmenu('produtos')}>
              <ListItemText primary="Produtos" sx={stylesNav.menuLink} />
              {subMenuAberto === 'produtos' ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse
            in={subMenuAberto === 'produtos'}
            timeout="auto"
            unmountOnExit
          >
            <List disablePadding>
              <ListItemButton sx={stylesNav.listItemButton}
                onClick={() => {
                  setEstaAtivo(false);
                  navigate('/produtos');
                }}
              >
                <ListItemText sx={stylesNav.submenuItem} primary="Ver Produtos" />
              </ListItemButton>

              <ListItemButton sx={stylesNav.listItemButton}
                onClick={() => {
                  setEstaAtivo(false);
                  navigate('/produto-add');
                }}
              >
                <ListItemText sx={stylesNav.submenuItem} primary="Adicionar Produto" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;

