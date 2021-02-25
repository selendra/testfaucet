import { Row } from 'antd'
import React from 'react'
import logo from '../assets/logo.png'
import '../styles/header.css'

function Header() {
  return (
    <div className='header'>
      <Row justify='center'>
        <img src={logo} className='header__logo'/>
      </Row>
    </div>
  )
}

export default Header
