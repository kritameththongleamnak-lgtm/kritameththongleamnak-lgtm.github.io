import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testWebsite() {
    console.log('Starting website test...');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Collect console errors
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });
    
    page.on('pageerror', err => {
        consoleErrors.push(err.message);
    });
    
    try {
        // Navigate to the local HTML file
        const filePath = path.join(__dirname, 'index.html');
        await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });
        
        console.log('Page loaded successfully');
        
        // Wait for animations to complete
        await page.waitForTimeout(2000);
        
        // Test 1: Check if main elements exist
        const title = await page.title();
        console.log(`Page title: ${title}`);
        
        const heroSection = await page.$('.hero');
        console.log(`Hero section exists: ${!!heroSection}`);
        
        const aboutSection = await page.$('#about');
        console.log(`About section exists: ${!!aboutSection}`);
        
        const skillsSection = await page.$('#skills');
        console.log(`Skills section exists: ${!!skillsSection}`);
        
        const contactSection = await page.$('#contact');
        console.log(`Contact section exists: ${!!contactSection}`);
        
        // Test 2: Check navigation links
        const navLinks = await page.$$('.nav-link');
        console.log(`Navigation links count: ${navLinks.length}`);
        
        // Test 3: Check skill tags
        const skillTags = await page.$$('.skill-tag');
        console.log(`Skill tags count: ${skillTags.length}`);
        
        // Test 4: Check responsive design elements
        const mobileNav = await page.$('.nav-toggle');
        console.log(`Mobile navigation exists: ${!!mobileNav}`);
        
        // Test 5: Report console errors
        if (consoleErrors.length > 0) {
            console.log('\nConsole errors found:');
            consoleErrors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        } else {
            console.log('\nNo console errors found!');
        }
        
        console.log('\n✅ All tests passed!');
        
    } catch (error) {
        console.error('Test failed:', error.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

testWebsite();
