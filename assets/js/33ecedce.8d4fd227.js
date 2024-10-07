"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[974],{894:(e,i,n)=>{n.r(i),n.d(i,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>s,metadata:()=>r,toc:()=>c});var t=n(4848),a=n(8453);const s={id:"visualize",title:"Visualize",sidebar_position:6},o="Visualize",r={id:"working-with-calm/visualize",title:"Visualize",description:"The visualize command allows you to create visual representations of your architecture directly from CALM definitions. This command produces an SVG file that visually depicts the nodes and relationships defined in your architecture.",source:"@site/docs/working-with-calm/visualize.md",sourceDirName:"working-with-calm",slug:"/working-with-calm/visualize",permalink:"/architecture-as-code/working-with-calm/visualize",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:6,frontMatter:{id:"visualize",title:"Visualize",sidebar_position:6},sidebar:"docsSidebar",previous:{title:"Validate",permalink:"/architecture-as-code/working-with-calm/validate"}},l={},c=[{value:"Basic Usage",id:"basic-usage",level:2},{value:"Command Options",id:"command-options",level:2},{value:"Example of Visualization",id:"example-of-visualization",level:2}];function d(e){const i={code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(i.header,{children:(0,t.jsx)(i.h1,{id:"visualize",children:"Visualize"})}),"\n",(0,t.jsxs)(i.p,{children:["The ",(0,t.jsx)(i.code,{children:"visualize"})," command allows you to create visual representations of your architecture directly from CALM definitions. This command produces an SVG file that visually depicts the nodes and relationships defined in your architecture."]}),"\n",(0,t.jsx)(i.h2,{id:"basic-usage",children:"Basic Usage"}),"\n",(0,t.jsxs)(i.p,{children:["To visualize an instantiation or a pattern, use the ",(0,t.jsx)(i.code,{children:"visualize"})," command with either the ",(0,t.jsx)(i.code,{children:"--instantiation"})," or ",(0,t.jsx)(i.code,{children:"--pattern"})," option:"]}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-shell",children:"calm visualize -i instantiation.json\n"})}),"\n",(0,t.jsxs)(i.p,{children:["This command generates an SVG file (",(0,t.jsx)(i.code,{children:"calm-visualization.svg"})," by default) that you can open in a browser or other image viewer."]}),"\n",(0,t.jsx)(i.h2,{id:"command-options",children:"Command Options"}),"\n",(0,t.jsxs)(i.ul,{children:["\n",(0,t.jsxs)(i.li,{children:[(0,t.jsx)(i.strong,{children:(0,t.jsx)(i.code,{children:"-i, --instantiation <file>"})}),": Path to an instantiation file of a CALM pattern."]}),"\n",(0,t.jsxs)(i.li,{children:[(0,t.jsx)(i.strong,{children:(0,t.jsx)(i.code,{children:"-p, --pattern <file>"})}),": Path to a CALM pattern file."]}),"\n",(0,t.jsxs)(i.li,{children:[(0,t.jsx)(i.strong,{children:(0,t.jsx)(i.code,{children:"-o, --output <file>"})}),": Path where the SVG file will be saved (default: ",(0,t.jsx)(i.code,{children:"calm-visualization.svg"}),")."]}),"\n",(0,t.jsxs)(i.li,{children:[(0,t.jsx)(i.strong,{children:(0,t.jsx)(i.code,{children:"-v, --verbose"})}),": Enable verbose logging to see detailed output."]}),"\n"]}),"\n",(0,t.jsx)(i.h2,{id:"example-of-visualization",children:"Example of Visualization"}),"\n",(0,t.jsxs)(i.p,{children:["Here is an example command that visualizes a pattern file and saves the output as ",(0,t.jsx)(i.code,{children:"architecture-diagram.svg"}),":"]}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-shell",children:"calm visualize -p calm/pattern/microservices.json -o architecture-diagram.svg\n"})}),"\n",(0,t.jsx)(i.p,{children:"The generated SVG provides a graphical view of the architecture, making it easier to understand and communicate your design."})]})}function h(e={}){const{wrapper:i}={...(0,a.R)(),...e.components};return i?(0,t.jsx)(i,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},8453:(e,i,n)=>{n.d(i,{R:()=>o,x:()=>r});var t=n(6540);const a={},s=t.createContext(a);function o(e){const i=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function r(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),t.createElement(s.Provider,{value:i},e.children)}}}]);