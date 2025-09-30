export const createMathSlashMenuItems = () => [
    {
        name: "Math Block",
        execute: (editor) => {
            // 简化的插入逻辑，避免类型问题
            if (editor && editor.insertBlocks) {
                editor.insertBlocks([{
                        type: "math",
                        props: { latex: "" }
                    }]);
            }
        },
        aliases: ["math", "equation", "formula", "latex"],
        group: "Math",
        icon: "√",
        hint: "Insert a math equation block"
    },
    {
        name: "Equation",
        execute: (editor) => {
            if (editor && editor.insertBlocks) {
                editor.insertBlocks([{
                        type: "math",
                        props: { latex: "" }
                    }]);
            }
        },
        aliases: ["eq", "eqn"],
        group: "Math",
        icon: "=",
        hint: "Insert an equation block"
    },
    {
        name: "Formula",
        execute: (editor) => {
            if (editor && editor.insertBlocks) {
                editor.insertBlocks([{
                        type: "math",
                        props: { latex: "" }
                    }]);
            }
        },
        aliases: ["gs", "gongshi"],
        group: "Math",
        icon: "∫",
        hint: "Insert a formula block"
    }
];
export const mathSlashMenuItems = createMathSlashMenuItems();
