import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from 'react-hot-toast';
import ChatLayout from './components/ChatLayout';

function App() {
  return (
    <Provider store={store}>
      <ChatLayout />
      <Toaster position="top-right" />
    </Provider>
  );
}

export default App;