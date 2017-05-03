import React from 'react';
import {Editor, EditorState, convertToRaw, convertFromRaw, RichUtils } from 'draft-js';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import diff from 'deep-diff';
import Immutable from 'immutable';

import _ from 'lodash';

const { pathToJS, dataToJS, toJS } = helpers;

function myBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  if (type === 'unstyled') {
    return 'custom-card custom-card-body custom-card-bordered';
  }
};

@connect(
    (state, props) => {

        const info = dataToJS(state.firebase, '.info');
        const projectKey = state.activeProject.key;
        const projectPath = 'projects/' + projectKey;

        return ({
        auth: pathToJS(state.firebase, 'auth'),
        profile: pathToJS(state.firebase, 'profile'),
        activeProject: dataToJS(state.firebase, projectPath),
        projectKey: projectKey,
        online: info ? info.connected : false,
        })}
)
@firebase((props) => {

    const projectPath = 'projects/' + props.projectKey;

    return ([
        [projectPath],
        ['.info'],
    ]);
})
class MyEditor extends React.Component {
  constructor(props) {

    super(props);
    
    const { firebase, projectKey, auth, activeProject } = this.props;

    this.focus = () => this.refs.editor.focus();

    this.state = {
      editorState: EditorState.createEmpty(),
      rehydrate: true,
    };

    this.onChange = (editorState) => {

      const previousEditorState = this.state.editorState;
      const selectionState = toJS(editorState.getSelection());
      var previousContent = convertToRaw(previousEditorState.getCurrentContent());
      const currentContent = convertToRaw(editorState.getCurrentContent());

      const changes = diff(previousContent, currentContent);

      if ( changes ) {
        firebase.push(`/projects/${projectKey}/updates/`, {author: auth.uid, time: Date.now(), changes: JSON.stringify(changes)}).then((input) => {
            firebase.set(`/projects/${projectKey}/latestUpdate`, input.key);
        });
      }

      firebase.set(`/projects/${projectKey}/content`, JSON.stringify(convertToRaw(editorState.getCurrentContent())));
      firebase.set(`/projects/${projectKey}/selections/${auth.uid}`, toJS(selectionState));

      this.setState({
        editorState: editorState,
      })

    };

    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  };

  handleKeyCommand(command) {
      const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
      if (newState) {
        this.onChange(newState);
        return 'handled';
      }
      return 'not-handled';
    };
  
  render() {
    return (
      <div onClick={this.focus}>
        {this.props.activeProject ? 
              <Editor 
              blockStyleFn={myBlockStyleFn} 
              editorState={this.state.editorState} 
              onChange={this.onChange} 
              handleKeyCommand={this.handleKeyCommand}
              ref='editor' 
              readOnly={this.props.online ? false : true}/>
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
          const { projectKey, activeProject, auth, firebase, profile } = nextProps;
          const { editorState, rehydrate, latestUpdate } = this.state;
          const userProjectData = _.find(profile.projects, (value, key) => {
                return (key === projectKey);
          });

          console.log(rehydrate)

          if (rehydrate && activeProject) {
              const previousContent = JSON.parse(activeProject.content);
              const newEditorState = EditorState.push(editorState, convertFromRaw(previousContent))
              console.log(convertToRaw(newEditorState.getCurrentContent()));

              this.setState({
                editorState: newEditorState,
                rehydrate: false,
              })

          } 

          if(activeProject && !rehydrate) {
            const { updates } = activeProject;
            const previousSelectionState = editorState.getSelection();
            const selection = this.selectionPicker(activeProject.selections, auth.uid);
            const selectionState = previousSelectionState.merge(selection);

            var updatedEditorState = this.state.editorState; 

            _.map(updates, (value, key) => {
              const isApplied = _.findKey(userProjectData.appliedUpdates, (v, k) => {
                return (key === k);
              });              
              if(!isApplied) {
                var previousContent = convertToRaw(this.state.editorState.getCurrentContent());
                const changes = JSON.parse(value.changes);

                _.forEach(changes, (change) => {
                  diff.applyChange(previousContent, true, change);
                });
                                  
                updatedEditorState = EditorState.push(this.state.editorState, convertFromRaw(previousContent));

                firebase.set(`users/${auth.uid}/projects/${projectKey}/appliedUpdates/${key}`, true);
              } 
            });

            const editorStateWithSelection = EditorState.acceptSelection(updatedEditorState, selectionState);
            
            this.setState({
              editorState: editorStateWithSelection,
            })
          }
          
      } 
  };
}

export default MyEditor;