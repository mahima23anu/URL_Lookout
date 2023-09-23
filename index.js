const express = require('express');
const {Builder, By} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const app=express()
const path = require('path');
const bodyParser =  require('body-parser');

app.use(bodyParser.json())
// app.use(express.static(path.join(__dirname,'index.html')))
app.use(express.static(path.join(__dirname, 'public')));


app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});

app.post('/submit',(req,res)=>{
    const inputValue=req.body.value;
    console.log('Received value:',inputValue)

    // res.json({message: 'Value received successfully!'});

    const websitesToMonitor = [
        { url: `${inputValue}`, name: 'test' },
        // Add more websites as needed
      ];
      
    async function takeSchreenshot(){
        const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().headless())
        .build()

        try{
            for(const website of websitesToMonitor){
                const {url,name}=website;
                await driver.get(url);
                const timestamp = new Date().toISOString().replace(/:/g, '-');
                const screenshotName = `${name}_${timestamp}.png`;
                await driver.takeScreenshot().then(data => {
                    require('fs').writeFileSync(`screenshots/${screenshotName}`, data, 'base64');
                });
            }
        } finally{
            await driver.quit();
        }
    }
    takeSchreenshot();
})



app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})
