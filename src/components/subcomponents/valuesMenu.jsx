import React, { Component } from 'react';
import Button from './button';
import './styling/menu.css'

class menu extends Component {
    state = {
        menus: this.props.menus,
        buttons: this.props.buttons,
    }
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({ menus: this.props.menus, buttons: this.props.buttons }, () => {
                this.addOnclickToButtons();
            });
        }
    }
    componentDidMount() {
        this.addOnclickToButtons();
    }
    addOnclickToButtons = () => {
        const buttons = [...this.state.buttons];
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].onclick == undefined) {
                buttons[i].onclick = () => {this.openMenu(i)};
            }
        }
        this.setState({ buttons: buttons });
    }
    openMenu = (id) => {
        const newDisplay = (this.state.menus[id].hidden) ? false : true;
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[id].hidden = newDisplay;
            return { menus: menus };
        }, () => {
            if(this.state.menus[id].ref != undefined) {
                this.props.menus[id].ref.current.focus();
            }
        });
    }
    renderMenu = () => {
        return this.state.menus.map(menu => 
           <React.Fragment>
                <div className={menu.class} style={{display: (menu.hidden) ? "none" : "block"}}>
                    {menu.text}
                    <button onClick={this.closeMenu} className='close'>Close Menu</button>
                </div>
                <Button
                    menu={this.menu}
                    button={this.state.buttons[menu.id]}
                />
           </React.Fragment>
        );
    }
    renderBackScreen = () => {
        if (this.menuIsOpen()) {
            return (
                <div className='backScreen' onClick={this.closeMenu}></div>

            ); 
        }       
    }
    menuIsOpen = () => {
        const menus = this.state.menus;
        for (let i = 0; i < menus.length; i++) {
            if(menus[i].hidden === false) {
                return true;
            }            
        }
    }
    closeMenu = () => {
        const menus = this.state.menus;
        for (let i = 0; i < menus.length; i++) {
            if(menus[i].hidden === false) {
                this.setState(prevState => {
                    const menus = prevState.menus;
                    menus[i].hidden = true;
                    return { menus: menus };
                });
            }            
        }
    }
    render() {
        return (
            <React.Fragment>
                {this.renderBackScreen()}
                {this.renderMenu()}
            </React.Fragment>
        );
    }
}
 
export default menu;