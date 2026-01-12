
async function testParams() {
    try {
        console.log("Testing with chatInput...");
        const response = await fetch('http://159.89.8.87:5678/webhook/stc-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chatInput: "Hello",
                sessionId: "test-session-js",
                locale: "en",
                apiUrl: "http://localhost:3000"
            })
        });

        console.log(`Status: ${response.status}`);
        const text = await response.text();
        console.log(`Body: '${text}'`);

        if (text) {
            try {
                const json = JSON.parse(text);
                console.log("JSON parsed successfully:", JSON.stringify(json, null, 2));
            } catch (e) {
                console.log("Not valid JSON");
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testParams();
