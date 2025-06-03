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
      zIndex: 1100
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
      marginRight: '140px'
    },
    sidebar: {
      left: '-100%',
      width: '600px',
      height: '100%',
      boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)',
      transition: 'left 0.3s ease-in-out',
      zIndex: 1001
    },
    sidebarActive: {
      left: 0
    },
    sideBarMenu: {
      listStyle: 'none',
      padding: '10px',
      marginTop: '60px',
      width: '260px',
    },
    menuItem: {
      borderBottom: '1px solid #ccc',
    },
    menuHeader: {
      padding: '15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer', 
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
      padding: '5px 0', 
    },
    listItemButton: {
      padding: '6px 20px',
      minHeight: '30px', 
      borderRadius: '6px',
      transition: 'background 0.3s ease-in-out',
      '&:hover': {
        background: '#f0f0f0',
      },
    },
    menuItemTitle: {
      color: 'inherit',
      textDecoration: 'none',
      fontSize: '14px', 
      fontWeight: 'bold',
    },
    submenuItem: {
      paddingLeft: '15px', 
      paddingBottom: '4px',
    },
  };

  export default stylesNav;