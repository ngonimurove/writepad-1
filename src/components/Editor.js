import React from 'react';
import {Editor, EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';

import _ from 'lodash';

const { pathToJS, dataToJS, toJS } = helpers;

function myBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  if (type === 'unstyled') {
    return 'custom-card custom-card-body custom-card-bordered';
  }
};

@firebase((props) => {
    return ([
        ['projects'],
    ]);
})
@connect(
    (state, props) => {
        return ({
        auth: pathToJS(state.firebase, 'auth'),
        projects: dataToJS(state.firebase, 'projects'),
        projectKey: state.activeProject.key
        })}
)
class MyEditor extends React.Component {
  constructor(props) {

    super(props);
    
    const { firebase, projectKey, auth } = this.props;

    this.focus = () => this.refs.editor.focus();

    this.state = {editorState: EditorState.createEmpty(),
                  activeProject: {}};

    this.onChange = (editorState) => {
      const selectionState = editorState.getSelection();
      firebase.set(`/projects/${projectKey}/content`, JSON.stringify(convertToRaw(editorState.getCurrentContent())));
      firebase.set(`/projects/${projectKey}/selections/${auth.uid}`, toJS(selectionState));
    };
  };

  render() {
    return (
      <div onClick={this.focus}>
        {this.props.projects ? 
              <Editor 
              blockStyleFn={myBlockStyleFn} 
              editorState={this.state.editorState} 
              onChange={this.onChange} 
              ref='editor' />
           : <div></div>}
      </div>
    );
  };

  selectionPicker(selections, uid) {
    const selectionList = _.transform(selections, (result, value, key) => {
            result.push({ uid: key, selection: value })
        }, []);
    const userSelection = _.find(selectionList, {uid: uid});
    return userSelection ? userSelection.selection : {};
  };

  componentWillUpdate(nextProps, nextState) {
      if (nextProps !== this.props) {
          const { projectKey, projects, auth } = nextProps;
          
          if ( projects ) {
                    
              const projectList = _.transform(projects, (result, value, key) => {
                        result.push({ key: key, name: value.name, owner: value.owner, selections: value.selections, content: value.content })
                    }, []);

              const activeProject = _.find(projectList, {key: projectKey});
              if (activeProject) {
                const newContentState = convertFromRaw(JSON.parse(activeProject.content));
                const newEditorState = EditorState.push(this.state.editorState, newContentState);

                const selection = this.selectionPicker(activeProject.selections, auth.uid);

                const previousSelectionState = newEditorState.getSelection();
                const selectionState = previousSelectionState.merge(selection);

                const editorStateWithSelection = EditorState.acceptSelection(newEditorState, selectionState);

                
                this.setState({
                  editorState: editorStateWithSelection,
                  activeProject: activeProject,
                });
              }                
          }
      } 
  };
}

export default MyEditor;