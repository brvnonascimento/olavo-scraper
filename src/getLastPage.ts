import { Page } from "puppeteer";
import { removeSlash } from "./utils";

const getLastPage = async (page: Page): Promise<number> => {
    const lastPageAnchor = await page.$(".last");
    const lastPageLinkHref = await lastPageAnchor.getProperty('href');
    const lastPageLinkJson = await lastPageLinkHref.jsonValue();
    const lastPage = (<string>lastPageLinkJson)
        .split('/page')[1]
        

    return Number(removeSlash(lastPage))
}

export default getLastPage