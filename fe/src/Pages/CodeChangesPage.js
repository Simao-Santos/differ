import React from 'react';
import Layout from '../Components/Layout';

function CodeChangesPage() {
    return (
        <Layout>
            <center>
                <h1>Code Changes</h1>
                <form>
                    <div>
                        <input type="text" name="url1" placeholder="Please write the first URL" size="50" />
                        <input type="text" name="url2" placeholder="Please write the second URL" size="50" />
                    </div>
                    <div>
                        <input type='submit' value="compare" />
                    </div>
                </form>
            </center>
        </Layout>
    );
}

export default CodeChangesPage;
