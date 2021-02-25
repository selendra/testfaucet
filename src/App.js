import { Row, Col, Form, Input, Button, message } from 'antd';
import './App.css';
import Header from './components/Header';
import { ReactComponent as Copy } from './assets/copy.svg';
import History from './utils/history';
import { useState } from 'react';
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const BigNumber = require("bignumber.js");

export default function App() {
  const [loading, setLoading] = useState(false);

  async function handleTransfer(val) {
    setLoading(true);

    // Check amount
    if(val.amount > 100) {
      setLoading(false);
      return message.error('can not send over 100 SEL');
    };

    const existing = localStorage.getItem(`account:${val.receiverAddress}`);
    if(existing) {
      const data = JSON.parse(existing);
      const lastValue = Number(data.value);
      const newValue = Number(val.amount);
      if(lastValue + newValue > 100) {
        setLoading(false);
        return message.error('You Already send 100 SEL!! Please comeback tomorrow');
      }
    }
    // End Check Amount
    // Save Transaction History
    History(val);
    // Transaction Function
    const wsProvider = new WsProvider('wss://rpc-testnet.selendra.org');
    const api = await ApiPromise.create({ provider: wsProvider });
    const keyring = new Keyring({ type: 'sr25519' });

    const senderPair = keyring.createFromUri(process.env.REACT_APP_Mnemonic);
    let chainDecimals = (10 ** api.registry.chainDecimals);
    let transferBalance = new BigNumber(val.amount * chainDecimals);

    const transfer = api.tx.balances.transfer(val.receiverAddress, transferBalance.toFixed());
    await transfer.signAndSend(senderPair, (result) => {
      message.success(`Current status is ${result.status}`);
      if (result.status.isInBlock) {
        message.success(`Transaction included at blockHash ${result.status.asInBlock}`);
      } else if (result.status.isFinalized) {
        message.success(`Transaction finalized at blockHash ${result.status.asFinalized}`);
        setLoading(false);
      }
    });
  }

  const onCopy = () => {
    /* Get the text field */
    var copyText = document.getElementById("receive__wallet");
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
    /* Copy the text inside the text field */
    document.execCommand("copy");
    /* Alert the copied text */
    alert("Copied the text: " + copyText.value);
  }

  return (
    <>
      <Header/>
      <div className="App">
        <div className='app__container'>
          <Row justify='center'>
            <p className='app__title'>Request Testnet Token</p>
            <Form onFinish={handleTransfer}>
              <Form.Item>
                <Input value='Indra Testnet' disabled/>
              </Form.Item>
              <Form.Item>
                <Input value='SEL' disabled/>
              </Form.Item>
              <Form.Item name='receiverAddress'>
                <Input placeholder='Address'/>
              </Form.Item>
              <Form.Item name='amount' label='You can get up to 100 SEL a day'>
                <Input placeholder='Amount'/>
              </Form.Item>
              <Form.Item>
                <Button block htmlType='submit' loading={loading}>Send Testnet SEL</Button>
              </Form.Item>
            </Form>
          </Row>
        </div>
        <div style={{paddingTop: '10px'}}>
          <Row justify='center'>
            <Col>
              <p className='app__return'>Return Testnet tokens</p>
              <div className='app__card'>
                <p className='app__address'>Testnet wallet address</p>
                <Row>
                  <input readOnly type="text" id="receive__wallet" value='5CUitEBxxEtcX8KhKLhg5xDcocnBTPru51kiB7M4hg9UT3q4'/>
                  <p style={{color: '#585D86'}}>5CUitEBxxEtcX8KhKLhg5xDcocnBTPru51kiB7M4hg9UT3q4</p>
                  <Copy onClick={onCopy} className='app__copy'/>
                </Row>
              </div>
              <p>Send coins back, when you don't need them anymore.</p>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}