import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Editor } from './Editor';
import { useState } from 'react';

const meta: Meta<typeof Editor> = {
 title: 'Components/Forms/Editor',
 component: Editor,
 tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Editor>;

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState('<p>Hello <strong>World</strong>!</p>');
    const [json, setJson] = useState<any>({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Hello " },
            { type: "text", marks: [{ type: "bold" }], text: "World" },
            { type: "text", text: "!" }
          ]
        }
      ]
    });

    return (
      <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
        <Editor 
          value={val} 
          onChange={(html, jsonVal) => {
            setVal(html);
            setJson(jsonVal);
          }} 
          placeholder="Write something..." 
        />
        
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-2 min-w-0">
            <h3 className="font-semibold text-default text-sm">HTML Output</h3>
            <pre className="bg-subtle border border-default text-default p-4 rounded-md overflow-x-auto text-xs h-96 whitespace-pre-wrap break-all">
              {val}
            </pre>
          </div>
          <div className="flex flex-col gap-2 min-w-0">
            <h3 className="font-semibold text-default text-sm">Rich JSON Output (ProseMirror Tree)</h3>
            <pre className="bg-subtle border border-default text-default p-4 rounded-md overflow-auto text-xs h-96">
              {JSON.stringify(json, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }
};
