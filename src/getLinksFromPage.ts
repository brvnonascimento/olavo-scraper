import { Page } from "puppeteer";

const getLinksFromPage = async (page: Page): Promise<string[]> => {
    const aTags = await page.$$("[rel='bookmark']");
    const hrefs = aTags.map(async link => {
        const href = await link.getProperty('href');
        const url = await href.jsonValue()
        return await url
    });

    const links = await Promise.all(hrefs);

    return (<string[]>links)
};

export default getLinksFromPage;