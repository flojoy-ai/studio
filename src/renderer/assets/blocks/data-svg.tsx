import { SVGProps, memo } from "react";
import { resolveBlockSVG } from "./svg-helper";

export const DefaultDataBlock = (props: SVGProps<SVGSVGElement>) => (
  <svg
    version="1.1"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      className="stroke-accent2"
      fill="none"
      stroke-miterlimit="10"
      stroke-width="2"
    >
      <path d="m49.23 37.879-8.3008-4.7891c-0.69141-0.39844-1.5469-0.39844-2.2383 0l-8.3008 4.7891c-0.85547 0.48047-1.3828 1.3828-1.3906 2.3594v9.3125c0 0.97266 0.51953 1.8711 1.3594 2.3594l8.3008 4.7891c0.69141 0.40234 1.5469 0.40234 2.2383 0l8.3008-4.7891c0.84375-0.48828 1.3594-1.3867 1.3594-2.3594v-9.3125c0.007812-0.96484-0.5-1.8633-1.3281-2.3594z" />
      <path d="m36.41 43.629 2 1.2812c0.84375 0.48828 1.8867 0.48828 2.7305 0l1.9297-1.1016" />
      <path d="m29.301 39.059 9.0977 5.8398c0.84375 0.48828 1.3594 1.3906 1.3633 2.3633v5.4609" />
      <path d="m50.5 39.539-9.3711 5.3594c-0.83984 0.48828-1.3594 1.3906-1.3594 2.3633v9.7383" />
      <path d="m34.898 54.539-4.5117 2.6094h0.003906c-0.85547 0.48047-1.3828 1.3828-1.3906 2.3633v9.3086c0 0.97266 0.51953 1.8711 1.3594 2.3594l8.332 4.8203c0.69141 0.39844 1.5469 0.39844 2.2383 0l8.3008-4.7891c0.83984-0.48828 1.3594-1.3867 1.3594-2.3594v-9.3398c0-0.97266-0.51953-1.875-1.3594-2.3633l-4.5781-2.6406" />
      <path d="m36.41 62.891 2 1.2812c0.84375 0.48438 1.8867 0.48438 2.7305 0l1.9297-1.1016" />
      <path d="m29.301 58.328 9.1094 5.8398v0.003906c0.83984 0.48438 1.3594 1.3867 1.3594 2.3594v5.4688" />
      <path d="m50.5 58.809-9.3789 5.3711c-0.84375 0.48828-1.3594 1.3867-1.3594 2.3594v9.7383" />
      <path d="m50.578 44.691 5.2109 3c0.69531 0.39844 1.5469 0.39844 2.2422 0l8.3008-4.7891-0.003906-0.003906c0.84375-0.48828 1.3633-1.3867 1.3633-2.3594v-9.3008c0-0.97266-0.51953-1.8711-1.3633-2.3594l-8.3281-4.7891c-0.69141-0.39844-1.5469-0.39844-2.2383 0l-8.3008 4.7891c-0.84375 0.48828-1.3594 1.3867-1.3594 2.3594v4.8203" />
      <path d="m53.52 34.629 2 1.2812c0.84375 0.48828 1.8867 0.48828 2.7305 0l1.9297-1.1016" />
      <path d="m46.398 30.059 9.1094 5.8398h0.003907c0.83984 0.48828 1.3594 1.3906 1.3594 2.3633v5.4609" />
      <path d="m67.609 30.539-9.3789 5.3594c-0.84375 0.48828-1.3594 1.3906-1.3594 2.3633v9.7383" />
      <path d="m50.578 64 5.2188 3h0.003906c0.68359 0.38672 1.5156 0.38672 2.1992 0l8.3008-4.7891c0.83984-0.48828 1.3594-1.3867 1.3594-2.3594v-9.3398c0-0.97266-0.51953-1.875-1.3594-2.3633l-4.5508-2.6289m-15.621 8.1719v1.6484m5.8984-9.8008-1.4297 0.82813" />
      <path d="m53.52 53.891 2 1.2812c0.84375 0.48438 1.8867 0.48438 2.7305 0l1.9297-1.1016" />
      <path d="m49.77 51.488 5.7305 3.6797v0.003906c0.83984 0.48438 1.3594 1.3867 1.3594 2.3594v5.4688" />
      <path d="m67.609 49.809-9.3789 5.3711c-0.84375 0.48828-1.3594 1.3867-1.3594 2.3594v9.7383" />
    </g>
  </svg>
);

const MatrixBlock = (
  <svg
    width="100pt"
    height="100pt"
    version="1.1"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m15.609 55.809c0.050781 0.19141 0.12891 0.37891 0.26953 0.51953l11.129 11.129c0.011719 0.011719 0.03125 0.019531 0.039063 0.03125l5.5039 5.5117c0.039063 0.039062 0.070313 0.070312 0.10938 0.10156l5.3711 5.3711c0.03125 0.03125 0.050781 0.070313 0.089844 0.10156l5.4609 5.4609c0.03125 0.039063 0.058594 0.078125 0.10156 0.10938l5.5586 5.5391c0.10156 0.10156 0.21875 0.17188 0.33984 0.23047 0.011719 0 0.011719 0.011719 0.011719 0.011719 0.125 0.042969 0.26562 0.074219 0.40625 0.074219s0.28125-0.03125 0.41016-0.078125c0.12891-0.050781 0.25-0.12891 0.35938-0.23828l5.5508-5.5391c0.03125-0.03125 0.058594-0.070312 0.089844-0.10938l5.4609-5.4492 0.011718-0.011719c0.011719-0.011719 0.011719-0.019531 0.011719-0.019531l22.227-22.227c0.19922-0.19922 0.32031-0.48047 0.32031-0.76953v-11.129h-0.019531c0-0.26953-0.10938-0.55078-0.32031-0.76172l-11.07-11.066c-0.011719-0.011718-0.019531-0.03125-0.03125-0.039062l-11.09-11.094c-0.011718-0.011719-0.019531-0.03125-0.03125-0.039062l-11.109-11.109c-0.19922-0.19922-0.48047-0.32031-0.76953-0.32031s-0.57031 0.12109-0.76953 0.32031l-11.109 11.109c-0.011719 0.011718-0.011719 0.011718-0.011719 0.019531l-11.109 11.102-11.109 11.109c-0.10156 0.10156-0.17188 0.21094-0.23047 0.33984 0 0.011719-0.011718 0.011719-0.019531 0.019531-0.011719 0.011719 0 0.03125 0 0.039063-0.039063 0.12109-0.070313 0.23828-0.070313 0.35938l-0.011718 11.121c0 0.070313 0.03125 0.12891 0.039062 0.19141 0.003906 0.039062 0.003906 0.058593 0.011719 0.078125zm22.18 19.332-3.6602-3.6602c-0.03125-0.03125-0.070312-0.070313-0.10938-0.10156l-5.1484-5.1719v-8.0078l8.9297 8.9297v8.0117zm-3.6094-14.719c-0.039063-0.050781-0.089844-0.10156-0.14844-0.14844l-4.6992-4.7188 4.7812-4.7695c0.03125-0.03125 0.070313-0.070312 0.10156-0.10938l4.6758-4.6758 9.5703 9.5703-4.7812 4.7695c-0.011719 0.011718-0.019532 0.019531-0.03125 0.03125l-4.7617 4.7617zm6.25-15.973 9.5703-9.5703 9.5625 9.5625-1.2695 1.2695-3.5195 3.5117c-0.011719 0.011719-0.019532 0.03125-0.03125 0.039063l-4.7617 4.75-4.7617-4.7695c-0.03125-0.03125-0.070312-0.070313-0.10938-0.089844zm8.4805 41.812-3.6797-3.6797c-0.03125-0.039062-0.070313-0.070312-0.10938-0.10156l-5.1523-5.1523 0.011719-8.0117 3.6992 3.6992 5.2383 5.2305 0.003906 8.0156zm1.0898-10.012-4.5781-4.5703-0.17969-0.17969c-0.011719-0.011719-0.019532-0.03125-0.03125-0.039062l-4.7891-4.7695 4.6914-4.6797c0.039063-0.03125 0.078125-0.058594 0.12109-0.10156l4.7656-4.7812 4.7812 4.7812c0.011719 0.011719 0.03125 0.019532 0.039062 0.03125l4.7578 4.7578-4.7695 4.7695c-0.011719 0.011719-0.019532 0.011719-0.019532 0.011719zm10.02 1.1016-5.1484 5.1484c-0.039063 0.03125-0.070313 0.058594-0.10156 0.089844l-3.6797 3.6797v-8.0117l8.9297-8.9102zm1.1016-12.211-4.7812-4.7695-0.023438-0.023438-4.7891-4.7812 4.6992-4.6992c0.039063-0.03125 0.070313-0.058594 0.10156-0.089844l4.7812-4.7773 9.5898 9.5703zm10.02 1.0781-8.9297 8.9102v-8.0117l8.9297-8.9102zm11.121-11.117-8.9414 8.9297v-8.0312l8.9414-8.9414zm-0.46094-10.652-9.5703 9.5703-9.5703-9.5703 9.5703-9.5586zm-11.109-11.129-7.5117 7.5117-2.0703 2.0586-4.7695-4.7695s0-0.011719-0.011719-0.011719c0 0 0-0.011719-0.011719-0.011719l-4.7891-4.7812 9.5781-9.5781zm-20.691-20.691 9.5703 9.5703-8.9883 8.9883-0.58203 0.59375-9.5703-9.5703zm-11.109 11.121 9.5781 9.5781-0.78125 0.78125-8.8008 8.7891-9.5703-9.5703zm-11.121 11.121 9.5703 9.5703-4.7891 4.7812c-0.03125 0.03125-0.070312 0.070313-0.10156 0.10938l-4.6914 4.6797-9.5703-9.5703zm-10.02 12.199 8.9297 8.9297v8.0312l-7.5195-7.5117-1.4219-1.4219z"
      className="fill-accent2"
    />
  </svg>
);

const LinspaceBlock = (
  <svg
    width="100pt"
    height="100pt"
    version="1.1"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m13.34 79.66 17.551 10.191c0.12891 0.070313 0.26172 0.078126 0.39844 0.10156 0.050782 0.019531 0.10156 0.050781 0.16016 0.050781 0.17969 0 0.37891-0.050781 0.53906-0.14844h0.019531l17.57-10.191c0.35156-0.19922 0.55859-0.55859 0.55859-0.94922v-7.2617c0.14844-0.019531 0.28125-0.070313 0.41016-0.12891l0.003906-0.023438 17.57-10.191c0.35156-0.19922 0.55859-0.55859 0.55859-0.94922v-7.2617c0.14844-0.019532 0.28125-0.050782 0.41016-0.12891l17.578-10.191c0.35156-0.19922 0.53906-0.55859 0.53906-0.94922l0.003907-20.367c0-0.12109-0.050782-0.23047-0.078126-0.32812-0.019531-0.078125-0.019531-0.16016-0.070312-0.23047-0.078125-0.16016-0.23047-0.30078-0.39844-0.39844l-17.426-10.156c-0.35156-0.19922-0.76953-0.19922-1.1211 0l-17.676 10.16c-0.070312 0.03125-0.10156 0.10156-0.14844 0.12891-0.10156 0.078125-0.19922 0.16016-0.26172 0.26172-0.03125 0.070312-0.03125 0.14844-0.050781 0.23047-0.050781 0.10156-0.10156 0.19922-0.10156 0.32812v7.3281c-0.10156 0.019531-0.19922 0.070312-0.30078 0.12109l-17.699 10.141c-0.050781 0.03125-0.078125 0.10156-0.12891 0.14844-0.10156 0.078125-0.19922 0.14844-0.26172 0.26172-0.050781 0.070313-0.03125 0.14844-0.070312 0.21094-0.03125 0.12109-0.078125 0.21094-0.078125 0.32812v7.3281c-0.12109 0.019531-0.21094 0.050781-0.30859 0.12109l-17.691 10.133c-0.070313 0.050782-0.10156 0.12109-0.14844 0.14844-0.10156 0.078125-0.19922 0.16016-0.26172 0.26172-0.03125 0.070313-0.03125 0.14844-0.050782 0.21094-0.050781 0.12109-0.10156 0.21094-0.10156 0.35156v20.352c0.003906 0.39844 0.22266 0.75781 0.5625 0.95703zm34.582-11.801v10.211l-15.359 8.9102-0.003906-17.941 6.5508-3.7383 2.2188-1.2695 3.75-2.1602 2.8281-1.6094 0.003906 7.5977zm18.539-18.559v10.211l-15.34 8.9102v-17.922l6.5391-3.75 2.2188-1.2695 3.7695-2.1602 2.8203-1.6094v7.5898zm18.551-8.332-15.359 8.9102-0.003906-17.93 12.531-7.1602 2.8281-1.6094zm-16.332-28.578 15.211 8.8594-15.461 8.8516-15.23-8.8398zm-16.578 10.801 15.18 8.8594 0.050781 6.3398-15.23-8.8594zm-2.2227 7.8984 0.25-0.14844 1.9805 1.1484 13.25 7.7109-7.6914 4.3984-2.2383 1.2695-5.5508 3.1797-15.211-8.8203zm-16.34 10.641 15.18 8.8594 0.050781 6.3594-15.23-8.8711zm-2.1992 7.8984 0.25-0.14844 1.9609 1.1406 13.27 7.7188-7.7109 4.4102-2.2109 1.2695-5.5586 3.1797-15.23-8.8398zm-16.328 10.652 15.18 8.8594 0.14844 17.809-15.328-8.8906z"
      className="fill-accent2"
    />
  </svg>
);

const FeedbackBlock = (
  <svg
    width="100pt"
    height="100pt"
    version="1.1"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m44.762 32.992c-0.12891 0.019531-0.25781 0.058593-0.375 0.11719l-9.4492 4.4102c-0.42969 0.20312-0.72656 0.66406-0.72656 1.1406 0 0.47656 0.29297 0.94141 0.72656 1.1406l9.4492 4.4102c0.76172 0.35547 1.7891-0.30078 1.7891-1.1406v-3.1484h27.66c0.60156 0 0.99219 0.011719 1.2383 0.039063 0.050781 6.2812 0.019531 13.031 0.019531 19.484 0 0.28516-0.015625 0.42969-0.019531 0.58984-0.15234 0.019532-0.28516 0.039063-0.60938 0.039063-0.64844 0-1.3711 0.007812-2.5156 0-0.66406-0.011719-1.2773 0.58594-1.2812 1.25-0.003907 0.66406 0.59766 1.2734 1.2617 1.2695 1.1602 0.007812 1.9023 0 2.5352 0 0.54297 0 0.98047-0.019531 1.4141-0.11719 0.43359-0.097656 0.94531-0.33594 1.2773-0.76953 0.33203-0.42969 0.40234-0.88281 0.43359-1.2383s0.019531-0.66406 0.019531-1.0234c-0.125-6.5195 0.17969-13.352-0.019531-19.762-0.035156-0.45312-0.125-1.0117-0.55078-1.4961-0.42578-0.48438-1.0156-0.65625-1.5117-0.72656-0.49609-0.070313-1.0078-0.058594-1.6875-0.058594h-27.66v-3.1484c0.003906-0.71484-0.70703-1.3477-1.4141-1.2578zm-1.1016 3.2266v4.8828l-5.207-2.4414zm-18.23 1.1797c-0.54297 0-0.98047 0-1.4141 0.097656s-0.94531 0.33594-1.2773 0.76953c-0.33203 0.42969-0.40234 0.88281-0.43359 1.2383 0.10156 7.3867-0.20313 14.312 0 20.785 0.035156 0.45313 0.125 1.0117 0.55078 1.4961s0.99609 0.65625 1.4922 0.72656c0.49609 0.070312 1.0273 0.078125 1.7109 0.078125h27.66v3.1484c-0.003906 0.85156 1.043 1.5156 1.8086 1.1406l9.4102-4.4102c0.42969-0.20312 0.72656-0.66406 0.72656-1.1406s-0.29297-0.94141-0.72656-1.1406l-9.4102-4.4102c-0.23047-0.11328-0.49219-0.15625-0.74609-0.11719-0.58984 0.09375-1.0664 0.66016-1.0625 1.2578v3.1484h-27.66c-0.60156 0-0.99219-0.03125-1.2383-0.058594-0.042968-6.7305-0.019531-14.125-0.019531-20.074 1.0508-0.039063 2.2617-0.023438 3.1445-0.019532 0.66406 0.007813 1.2734-0.59375 1.2734-1.2578s-0.60938-1.2695-1.2734-1.2578c-1.1602-0.007813-1.8828 0-2.5156 0zm30.801 21.492 5.207 2.4414-5.207 2.4414z"
      className="fill-accent2"
    />
  </svg>
);

const SineBlock = (
  <svg
    width="100pt"
    height="100pt"
    version="1.1"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g className="fill-accent2">
      <path d="m84.844 49.219c-4.5312-19.688-8.5938-38.281-18.125-38.281s-13.75 18.594-18.125 38.281c-3.9062 4.375-7.8125 8.5938-15.156 8.5938-7.5 0-11.25-4.0625-15.156-8.5938-4.5312-19.688-8.75-38.281-18.281-38.281v3.125c3.4375 0 6.25 4.6875 8.75 11.562-2.3438-3.2812-5.1562-5.3125-8.75-5.3125v3.125c4.2188 0 7.3438 4.6875 10 11.25-2.6562-2.9688-5.7812-5-10-5v3.125c5.1562 0 8.5938 4.2188 11.562 10-2.9688-2.1875-6.5625-3.75-11.562-3.75v3.125c7.5 0 11.25 4.0625 15.156 8.5938 4.5312 19.688 8.5938 38.281 18.125 38.281s13.75-18.594 18.125-38.281c3.9062-4.375 7.8125-8.5938 15.156-8.5938 7.5 0 11.25 4.0625 15.156 8.5938 4.5312 19.688 8.75 38.281 18.281 38.281v-3.125c-3.4375 0-6.25-4.6875-8.75-11.562 2.3438 3.2812 5.1562 5.3125 8.75 5.3125v-3.125c-4.2188 0-7.3438-4.6875-10-11.25 2.6562 3.125 5.7812 5 10 5v-3.125c-5.1562 0-8.5938-4.2188-11.562-10 2.9688 2.1875 6.5625 3.75 11.562 3.75v-3.125c-7.5 0-11.25-4.0625-15.156-8.5938zm-18.125-35.156c3.4375 0 6.25 4.6875 8.75 11.562-2.5-3.2812-5.3125-5.3125-8.75-5.3125-3.5938 0-6.4062 2.0312-8.75 5.3125 2.3438-6.875 5.1562-11.562 8.75-11.562zm10 20.625c-2.6562-3.125-5.7812-5-10-5s-7.3438 2.0312-10 5c2.6562-6.5625 5.7812-11.25 10-11.25s7.3438 4.6875 10 11.25zm-31.875 22.5c-2.9688 5.7812-6.4062 10-11.562 10s-8.5938-4.2188-11.562-10c2.9688 2.1875 6.5625 3.75 11.562 3.75s8.5938-1.5625 11.562-3.75zm-1.5625 8.125c-2.6562 6.5625-5.7812 11.25-10 11.25s-7.3438-4.6875-10-11.25c2.6562 3.125 5.7812 5 10 5s7.3438-2.0312 10-5zm-10 20.625c-3.4375 0-6.25-4.6875-8.75-11.562 2.3438 3.2812 5.1562 5.3125 8.75 5.3125s6.4062-2.0312 8.75-5.3125c-2.3438 6.875-5.1562 11.562-8.75 11.562zm21.875-43.125c2.9688-5.7812 6.4062-10 11.562-10s8.5938 4.2188 11.562 10c-2.9688-2.1875-6.5625-3.75-11.562-3.75s-8.5938 1.5625-11.562 3.75z" />
      <path d="m0 48.438h3.125v3.125h-3.125z" />
      <path d="m6.25 48.438h3.125v3.125h-3.125z" />
      <path d="m90.625 48.438h3.125v3.125h-3.125z" />
      <path d="m96.875 48.438h3.125v3.125h-3.125z" />
      <path d="m25 48.438h3.125v3.125h-3.125z" />
      <path d="m31.25 48.438h3.125v3.125h-3.125z" />
      <path d="m37.5 48.438h3.125v3.125h-3.125z" />
      <path d="m59.375 48.438h3.125v3.125h-3.125z" />
      <path d="m65.625 48.438h3.125v3.125h-3.125z" />
      <path d="m71.875 48.438h3.125v3.125h-3.125z" />
    </g>
  </svg>
);

const ConstantBlock = (
  <svg
    width="100pt"
    height="100pt"
    version="1.1"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m79.879 20.555c-0.18359-0.082032-0.37109-0.10938-0.5625-0.10938v-0.015624l-42.918 0.003906c-0.32422 0-0.63672 0.11719-0.88281 0.32812l-15.711 13.516 0.011718 0.011718c-0.28906 0.24609-0.48047 0.60156-0.48047 1.0117v42.914c0 0.74609 0.60547 1.3516 1.3516 1.3516h42.914c0.33984 0 0.63672-0.13672 0.87109-0.33984l0.011719 0.011719 15.715-13.516c0.30078-0.25781 0.46875-0.63281 0.46875-1.0234v-42.914c-0.003907-0.52734-0.30859-1.0117-0.78906-1.2305zm-1.918 43.469h-13.012l0.003906-28.102 13.012-11.191zm-1.5078 1.3516-11.5 9.8945v-9.8945zm-40.73-0.98438-13.684 11.77v-39.512h13.688zm1.3516-27.738h25.176v27.371h-25.176zm26.023-2.7031h-26.023v-10.812h38.594zm-27.375-9.8008v9.8008h-11.391zm-12.43 52.715 13.355-11.488h25.602v11.488z"
      className="fill-accent2"
    />
  </svg>
);

const RandBlock = (
  <svg
    width="100pt"
    height="100pt"
    version="1.1"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m50 21.66c-2.2031 0-3.9844 1.1328-7.1875 2.9844l-11.176 6.4531c-3.2031 1.8477-5.0742 2.8242-6.1758 4.7344-1.1016 1.9062-1.0117 4.0195-1.0117 7.7148v12.906c0 3.6992-0.089844 5.8086 1.0117 7.7148 1.1016 1.9062 2.9766 2.8828 6.1758 4.7344l11.176 6.4531c3.2031 1.8477 4.9844 2.9844 7.1875 2.9844s3.9844-1.1328 7.1836-2.9844l11.18-6.4531c3.2031-1.8477 5.0742-2.8242 6.1758-4.7344 1.1016-1.9062 1.0117-4.0195 1.0117-7.7148v-12.906c0-3.6992 0.089844-5.8086-1.0117-7.7148-1.1016-1.9062-2.9727-2.8828-6.1758-4.7344l-11.18-6.4531c-3.2031-1.8477-4.9805-2.9844-7.1836-2.9844zm0 3.125c1 0 2.418 0.71484 5.6211 2.5664l11.18 6.4531c1.8984 1.0938 3.0859 1.832 3.8828 2.4414l-15.062 8.6992c-3.2031 1.8477-4.6211 2.5625-5.6211 2.5625s-2.4219-0.71484-5.625-2.5625l-15.062-8.6953c0.80078-0.61328 1.9883-1.3477 3.8867-2.4453l11.176-6.4531c3.2031-1.8477 4.625-2.5664 5.625-2.5664zm-12.625 9.1836c-2.082 0-3.7695 0.97656-3.7695 2.1758 0 1.2031 1.6875 2.1758 3.7695 2.1758s3.7695-0.97656 3.7695-2.1758c0-0.58984-0.41016-1.1523-1.1406-1.5625-0.70312-0.39453-1.6484-0.61328-2.6289-0.61328zm12.625 0c-2.082 0-3.7695 0.97656-3.7695 2.1758 0 1.2031 1.6914 2.1758 3.7695 2.1758 2.082 0 3.7695-0.97266 3.7695-2.1758 0-0.56641-0.38281-1.1133-1.0664-1.5195-0.71094-0.42188-1.6836-0.66016-2.7031-0.66016zm12.621 0c-2.082 0-3.7695 0.97656-3.7695 2.1758 0 1.2031 1.6914 2.1758 3.7695 2.1758 2.082 0 3.7695-0.97266 3.7695-2.1758 0-0.58984-0.41016-1.1523-1.1406-1.5625-0.70312-0.39453-1.6445-0.61328-2.625-0.61328zm9.6289 4.9844c0.12891 1 0.17578 2.3945 0.17578 4.5898v12.906c0 3.6992-0.089843 5.2891-0.58984 6.1523-0.5 0.86719-1.8281 1.7383-5.0312 3.5898l-11.18 6.4531c-1.8984 1.0977-3.1289 1.7578-4.0586 2.1445v-17.395c0-3.6992 0.089844-5.2891 0.58984-6.1523 0.5-0.86719 1.8281-1.7383 5.0312-3.5898l15.062-8.6953zm-44.496 0.003906 15.059 8.6953c3.2031 1.8477 4.5312 2.7227 5.0312 3.5898 0.5 0.86719 0.59375 2.4531 0.59375 6.1523v17.395c-0.92969-0.38672-2.1641-1.0469-4.0625-2.1445l-11.176-6.4531c-3.2031-1.8477-4.5312-2.7227-5.0312-3.5898-0.5-0.86719-0.59375-2.4531-0.59375-6.1523v-12.906c0-2.1914 0.046875-3.5859 0.17578-4.5859zm41.555 3.6016c-0.32812 0.035156-0.67969 0.16016-1.043 0.375-0.69141 0.41016-1.3555 1.1172-1.8438 1.9648-1.0391 1.8047-1.0391 3.75 0 4.3516s2.7266-0.37109 3.7695-2.1758c1.0391-1.8047 1.0391-3.7539 0-4.3555-0.25391-0.14844-0.55469-0.19922-0.88281-0.16406zm-26.027 7.2812c-0.3125-0.027344-0.60156 0.03125-0.84766 0.17188-1.0391 0.60156-1.0391 2.5469 0 4.3516 1.0391 1.8047 2.7266 2.7773 3.7695 2.1758 1.0391-0.60156 1.0391-2.5508 0-4.3555-0.50781-0.88281-1.1992-1.6055-1.9219-2.0078-0.34766-0.19531-0.6875-0.30859-1-0.33594zm13.445 0c-0.3125 0.027344-0.65234 0.13672-1 0.33203-0.71875 0.40234-1.4141 1.1289-1.9219 2.0117-1.0391 1.8047-1.0391 3.75 0 4.3516 1.0391 0.60156 2.7266-0.37109 3.7695-2.1758 1.0391-1.8047 1.0391-3.7539 0-4.3555-0.24609-0.14062-0.53125-0.19531-0.84766-0.16797zm12.621 0c-0.3125 0.027344-0.65234 0.13672-1 0.33203-0.71875 0.40234-1.4141 1.1289-1.9219 2.0117-1.0391 1.8047-1.0391 3.7539 0 4.3555 1.0391 0.60156 2.7266-0.375 3.7695-2.1758 1.0391-1.8047 1.0391-3.7539 0-4.3555-0.24609-0.14062-0.53125-0.19531-0.84766-0.16797zm-38.688 7.2852c-0.3125-0.027344-0.60156 0.027344-0.84766 0.17188-1.0391 0.60156-1.0391 2.5508 0 4.3555 1.0391 1.8047 2.7305 2.7734 3.7695 2.1758 1.0391-0.60156 1.0391-2.5469 0-4.3516-0.50781-0.88281-1.2031-1.6094-1.9219-2.0117-0.34766-0.19531-0.6875-0.30859-1-0.33594zm26.066 0c-0.3125 0.027344-0.65234 0.14062-1 0.33594-0.71875 0.40234-1.4141 1.1289-1.9219 2.0078-1.0391 1.8047-1.0391 3.7539 0 4.3555 1.0391 0.60156 2.7266-0.375 3.7695-2.1758 1.0391-1.8047 1.0391-3.75 0-4.3516-0.24609-0.14062-0.53125-0.19922-0.84766-0.17188zm12.621 0c-0.3125 0.027344-0.65234 0.14062-1 0.33594-0.71875 0.40625-1.4141 1.1289-1.9219 2.0117-1.0391 1.8047-1.0391 3.75 0 4.3516 1.0391 0.60156 2.7266-0.37109 3.7695-2.1758 1.0391-1.8047 1.0391-3.7539 0-4.3555-0.24609-0.14062-0.53125-0.19922-0.84766-0.17188zm-12.656 7.293c-0.32812 0.035156-0.67969 0.16016-1.043 0.37109-0.69531 0.41406-1.3555 1.1211-1.8438 1.9688-1.0391 1.8047-1.0391 3.75 0 4.3516 1.0391 0.60156 2.7266-0.37109 3.7695-2.1758 1.0391-1.8047 1.0391-3.7539 0-4.3555-0.25391-0.14844-0.55469-0.19922-0.88281-0.16406z"
      className="fill-accent2"
      fill-rule="evenodd"
    />
  </svg>
);

const blockNameToSVGMap = {
  default: <DefaultDataBlock width="100pt" height="100pt" />,
  MATRIX: MatrixBlock,
  LINSPACE: LinspaceBlock,
  FEEDBACK: FeedbackBlock,
  SINE: SineBlock,
  CONSTANT: ConstantBlock,
  RAND: RandBlock,
};
const DataBlockSvg = resolveBlockSVG(blockNameToSVGMap);

export default memo(DataBlockSvg);