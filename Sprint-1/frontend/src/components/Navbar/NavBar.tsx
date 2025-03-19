import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Box, Collapse, Drawer, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { ExpandLess, ExpandMore, Height } from '@mui/icons-material';
import Logo from 'public/img/rmenezes.jpg';

const Navbar: React.FC = () => {
  const [estaAtivo, setEstaAtivo] = useState(false);
  const [subMenuAberto, setSubMenuAberto] = useState<string | null>(null);

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
        <i className="bi bi-list menu-btn" onClick={Menu} style={{ fontSize: '40px'}}></i>
        <Box sx={stylesNav.logoContainer}>
        <Box
          component="img"
          src="img/rmenezes.jpg" 
          alt="Logo RMENEZES" 
          sx={stylesNav.logo}
        />
          <img  />
        </Box>
      </Box>

      <Drawer
        anchor="left"
        open={estaAtivo} // Controla se o Drawer está aberto ou fechado
        onClose={() => setEstaAtivo(false)} // Fecha o Drawer ao clicar fora dele
        sx={stylesNav.sidebar} // Aplica os estilos do stylesNav
      >
        <List sx={stylesNav.sidebarUl}>
          {/* Menu Item: Clientes */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => mostrarSubmenu('clientes')}>
              <ListItemText primary="Clientes" sx={stylesNav.menuLink} />
              {subMenuAberto === 'clientes' ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={subMenuAberto === 'clientes'} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={stylesNav.submenu}>
              <ListItemButton sx={stylesNav.submenuLink}>
                <ListItemText primary="Submenu 1" />
              </ListItemButton>
              <ListItemButton sx={stylesNav.submenuLink}>
                <ListItemText primary="Submenu 2" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItem disablePadding>
            <ListItemButton onClick={() => mostrarSubmenu('produtos')}>
              <ListItemText primary="Produtos" sx={stylesNav.menuLink} />
              {subMenuAberto === 'produtos' ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={subMenuAberto === 'produtos'} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={stylesNav.submenu}>
              <ListItemButton sx={stylesNav.submenuLink}>
                <ListItemText primary="Submenu 1" />
              </ListItemButton>
              <ListItemButton sx={stylesNav.submenuLink}>
                <ListItemText primary="Submenu 2" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;

const stylesNav = {
  global: {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif'
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#111',
    padding: '10px 20px',
    color: 'white',
    position: 'fixed',
    width: '100%',
    height: '50px',
    top: 0,
    zIndex: 1100,
  },
  menuBtn: {
    fontSize: '50px',
    cursor: 'pointer'
  },
  logoContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  logo: {
    height: '40px',
    marginRight: '140px',
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    left: '-100%',
    width: '250px',
    height: '100%',
    background: '#fff',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)',
    transition: 'left 0.3s ease-in-out',
    zIndex: 1001
  },
  sidebarActive: {
    left: 0
  },
  sidebarUl: {
    listStyle: 'none',
    padding: '10px'
  },
  menuItem: {
    borderBottom: '1px solid #ccc'
  },
  menuHeader: {
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer'
  },
  menuLink: {
    color: 'inherit',
    textDecoration: 'none',
    flex: 1
  },
  arrow: {
    transition: 'transform 0.3s ease'
  },
  menuItemActive: {
    transform: 'rotate(90deg)'
  },
  submenu: {
    display: 'none',
    background: '#f8f8f8',
    borderRadius: '5px',
    padding: '10px',
    marginTop: '5px'
  },
  submenuActive: {
    display: 'block'
  },
  submenuLink: {
    color: 'inherit',
    textDecoration: 'none',
    display: 'block',
    padding: '5px 0'
  }
};
