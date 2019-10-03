export interface WordpressFeedType { 
    rss: { 
        channel: [{ 
            item: [{ 
                title: [string], 
                pubDate: [string], 
                link: [string], 
                'dc:creator': [string], 
                guid: [{ 
                    _: string 
                }] 
            }], 
        }], 
    } 
} 