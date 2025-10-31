import React from 'react';
import MyButton from './index';

const MyButtonExample = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Position Aware Button Examples</h2>

      <div style={{ marginBottom: '20px' }}>
        <MyButton onClick={() => alert('Default button clicked!')}>
          Default Button
        </MyButton>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <MyButton
          className="primary"
          onClick={() => alert('Primary button clicked!')}
        >
          Primary Button
        </MyButton>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <MyButton
          className="success"
          onClick={() => alert('Success button clicked!')}
        >
          Success Button
        </MyButton>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <MyButton
          className="danger"
          onClick={() => alert('Danger button clicked!')}
        >
          Danger Button
        </MyButton>
      </div>
    </div>
  );
};

export default MyButtonExample;
