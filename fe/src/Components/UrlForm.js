import React from 'react';

function UrlForm() {
    return (
        <div className="URL-Form">
            <form>
                <div>
                    <input type="text" name="url1" placeholder="Please write the first URL" size="50" />
                    <input type="text" name="url2" placeholder="Please write the second URL" size="50" />
                </div>
                <div>
                    <input type='submit' value="compare" />
                </div>
            </form>
        </div>
    );
}

export default UrlForm;