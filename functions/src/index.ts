import * as path from'path' ;
import * as os from 'os';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
import * as puppeteer from 'puppeteer';
import type { Browser, Page } from 'puppeteer';

admin.initializeApp();

const TIMEOUT = 120 * 1000;
const TMPDIR = os.tmpdir();

exports.puppeteerCronjob = functions.runWith({ timeoutSeconds: 300, memory: '2GB' }).pubsub.schedule('0 */6 * * *').timeZone('Europe/Paris').onRun(async () => {
    const date = getDate();    
    await getScreenshots();
    await uploadScreenshots(date);
});

function getDate(){
    const date = new Date().toLocaleString('sv', {timeZone: 'Europe/Paris'});
    return `${date.split(' ')[0]}-${date.split(' ')[1].split(':')[0]}`; 
}

async function getScreenshots(){
    const browser = await puppeteer.launch();
    await getScreenshot(browser, 'https://edition.cnn.com/', 'CNN');
    await getScreenshot(browser, 'https://www.foxnews.com/', 'FOX');
    await browser.close();
}

async function uploadScreenshots(timestamp: string){
    const storage = new Storage();
    const bucket = storage.bucket('us-media-archive.appspot.com');  
    await bucket.upload(path.resolve(`${TMPDIR}/CNN.jpg`), { destination: `images/CNN/${timestamp}.jpg` });
    await bucket.upload(path.resolve(`${TMPDIR}/FOX.jpg`), { destination: `images/FOX/${timestamp}.jpg` });
}

async function getScreenshot(browser: Browser, url: string, name: string){
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(TIMEOUT);
    await page.setViewport({
        width: 1200,
        height: 800
    });  
    await page.goto(url);
    await scrollToBottom(page);
    await waitForImagesToLoad(page);
    await page.screenshot({
        path: `${TMPDIR}/${name}.jpg`,
        fullPage: true,
        type: 'jpeg'
    });
    await page.close();
}

async function waitForImagesToLoad(page: Page){
    await page.evaluate(async () => {
        const selectors = Array.from(document.querySelectorAll("img"));
        await Promise.all(selectors.map(img => {
            if (img.complete) return;
            return new Promise((resolve, reject) => {
                img.addEventListener('load', resolve);
                img.addEventListener('error', reject);
            });
        }));
    });
}

async function scrollToBottom(page: Page){
    await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
