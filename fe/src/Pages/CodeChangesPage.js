import React from 'react';
import CodeComparison from '../Components/CodeComparison';

function CodeChangesPage() {
    return (
        <>
            <h1>Code Changes</h1>
            <div className="Code-Cards">
                <CodeComparison pageName="PAGE NAME IS OVER HERE" />
            </div>
        </>
    );
}

export default CodeChangesPage;