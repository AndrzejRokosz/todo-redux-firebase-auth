import React from 'react'
import Auth from './Auth'
import Todo from './Todo'

class App extends React.Component {

  render() {
    return (
      <div>
        <Auth>
          <div>
            <Todo />
          </div>
        </Auth>
      </div>

    )
  }

}

export default App
