import React from 'react';
import {Editor, EditorState, convertToRaw} from 'draft-js';
import { firebase } from 'redux-react-firebase';

@firebase()
class MyEditor extends React.Component {
  constructor(props) {

    super(props);
    
    const { firebase } = this.props;

    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => {
      this.setState({editorState});
      firebase.set('/documents', convertToRaw(editorState.getCurrentContent())).catch((error) => {console.log(error)});
    };
  }
  render() {
    return (
        <Editor editorState={this.state.editorState} onChange={this.onChange} />
    );
  }
}

export default MyEditor;