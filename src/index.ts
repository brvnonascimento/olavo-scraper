import { launch } from 'puppeteer'
import getLastPage from './getLastPage'
import { ARTICLES_URL, BASE_URL } from './constants'
import getLinksFromPage from './getLinksFromPage';
import { removeSlash, toArray } from './utils';

(async () => {
    const browser = await launch();
    const page = await browser.newPage();
    await page.goto(ARTICLES_URL);
    
    const lastPage = await getLastPage(page);
    console.log('Last page:', lastPage);
    page.close();
    
    const getArticleLinks = async (lastPage: number) => {
        let links: string[] = [];

        for (let i = 1; i <= lastPage; i++) {
            console.log(`Buscando links em página ${i} de ${lastPage}...`)
            const articlesPage = await browser.newPage();
            articlesPage.setDefaultNavigationTimeout(0);
            await articlesPage.goto(`${ARTICLES_URL}page/${i}/`)
            const articles = await getLinksFromPage(articlesPage);

            articles.forEach(article => links.push(article));
            await articlesPage.close();
        }

        console.log('Links obtidos!')

        return links
    }

    const links = await getArticleLinks(lastPage);
    const linksCount = links.length;

    links.forEach(async (link, i) => {
        console.log(`Gerando PDF ${i} de ${linksCount}...`)
        const articleName = removeSlash(link.split(BASE_URL)[1]);
    
        const article = await browser.newPage();
        article.setDefaultNavigationTimeout(0);
        await article.goto(link);
        await article.evaluate(() => {
            const title = document.getElementById('page-title').innerText;
            const text = document.getElementById('main-content').innerHTML;
    
            document.querySelectorAll('body').forEach(elem => {
                elem.innerHTML = ''
            })
    
            document.querySelector('body').innerHTML = `
                <h1>${title}</h1>
                ${text.split('Comments')[0]}
            `
        });
        await article.pdf({ path: `./articles/${articleName}.pdf`, format: 'A4' });
        await article.close()
        console.log('PDF Gerado!')
    })
})()
