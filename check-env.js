async function check() {
    try {
        const res = await fetch('http://localhost:3000/api/test-env');
        console.log(await res.text());
    } catch (e) {
        console.error(e);
    }
}
check();
