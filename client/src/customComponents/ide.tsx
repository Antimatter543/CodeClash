import ReactDOM from 'react-dom';
import Editor from '@monaco-editor/react';

export default function IDE() {
    const options: Monaco.IStandaloneEditorConstructionOptions = {
        readOnly: false,
        minimap: { enabled: false },
    }

    return (
        <Editor
        defaultLanguage="javascript"
        defaultValue="// some comment"
        options = {options}
        />
    );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<IDE />, rootElement);