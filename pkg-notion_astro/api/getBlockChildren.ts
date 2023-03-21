import { Client } from '@notionhq/client';
import { config } from 'dotenv';

//const dotenv = require("dotenv")
config();
// get notion client object
const notion = getNotionClient();
export function getNotionClient() {
  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });

  return notion;
}

export interface Block {
  object: string;
  id: string;
  created_time: string;
  last_edited_time: string;
  has_children: boolean;
  [key: string]: any;
}

export async function getBlockChildren(blockId: string): Promise<Block[]> {
  try {
    const blocks = Block[] = [];
    let has_more_blocks = true;
    let cursor: string;
    const max_page_limit = 100;

    while (has_more_blocks) {
      const { results, next_cursor, has_more } =
        await notion.blocks.children.list({
          start_cursor: cursor,
          block_id: blockId,
          page_size: max_page_limit,
        });
      blocks.push(...results);

      cursor = next_cursor;
      has_more_blocks = has_more;
    }
    return blocks;
  } catch (error) {
    console.error(error);
    return[];
  }
}
