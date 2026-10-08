import { HeaderBar, SideBar } from "../../components";

export default function Configuracoes() {
  return (
    <>
      <SideBar />
      <main className="ml-60 p-6 bg-[#F8FAFC] min-h-screen">
        <HeaderBar page="Configurações" desc={"Gerenciamento das preferências e dados do sistema."} />
        <div className="flex flex-col mb-4 items-center">
        <div className="w-5/6 h-full bg-white p-5 pr-10 rounded-[10px] mt-15">
          <div className="flex items-center border-b border-gray-200 ">
            <div className="w-12 h-12 bg-purple-400/20 rounded-xl flex justify-center items-center">
            <svg width="26px" height="26px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>profile [#1341]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-180.000000, -2159.000000)" fill="#7b2cbf"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M134,2008.99998 C131.783496,2008.99998 129.980955,2007.20598 129.980955,2004.99998 C129.980955,2002.79398 131.783496,2000.99998 134,2000.99998 C136.216504,2000.99998 138.019045,2002.79398 138.019045,2004.99998 C138.019045,2007.20598 136.216504,2008.99998 134,2008.99998 M137.775893,2009.67298 C139.370449,2008.39598 140.299854,2006.33098 139.958235,2004.06998 C139.561354,2001.44698 137.368965,1999.34798 134.722423,1999.04198 C131.070116,1998.61898 127.971432,2001.44898 127.971432,2004.99998 C127.971432,2006.88998 128.851603,2008.57398 130.224107,2009.67298 C126.852128,2010.93398 124.390463,2013.89498 124.004634,2017.89098 C123.948368,2018.48198 124.411563,2018.99998 125.008391,2018.99998 C125.519814,2018.99998 125.955881,2018.61598 126.001095,2018.10898 C126.404004,2013.64598 129.837274,2010.99998 134,2010.99998 C138.162726,2010.99998 141.595996,2013.64598 141.998905,2018.10898 C142.044119,2018.61598 142.480186,2018.99998 142.991609,2018.99998 C143.588437,2018.99998 144.051632,2018.48198 143.995366,2017.89098 C143.609537,2013.89498 141.147872,2010.93398 137.775893,2009.67298" id="profile-[#1341]"> </path> </g> </g> </g> </g></svg> 
            </div>
            <div className="p-5">
              <h1 className="font-semibold text-[15px]">Perfil da conta</h1>
              <p className="text-[15px]">Atualize as informações da conta</p>
            </div>
          </div>
          <div className="flex gap-3.5 justify-between">
            <div className="w-full mt-5">
                  <label for="nome" className="text-[15px] font-semibold">Nome:</label>
                  <input type="text" id="nome" placeholder="Admin" className="bg-gray-200/30  w-full h-6.5 rounded-[5px] text-[15px] p-2"/>
            </div>
            <div className="w-full mt-5">
                  <label for="nome" className="text-[15px] font-semibold">E-mail:</label>
                  <input type="text" id="nome" placeholder="Admin@gmail.com" className="bg-gray-200/30  w-full h-6.5 rounded-[5px] text-[15px] p-2"/>
            </div>
            <div className="w-full mt-5">
                  <label for="nome" className="text-[15px] font-semibold">Exemplo:</label>
                  <input type="text" id="nome" placeholder="depay" className="bg-gray-200/30  w-full h-6.5 rounded-[5px] text-[15px] p-2"/>
            </div>
          </div>
          <div   className="flex justify-end mt-5">
            <button className="cursor-pointer w-25 h-8 bg-purple-500 text-white text-[15px] rounded-sm flex items-center justify-center">
            <svg width="25px" height="25px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fillRule="evenodd" clipRule="evenodd" d="M17.7 5.12758L19.266 6.37458C19.4172 6.51691 19.5025 6.71571 19.5013 6.92339C19.5002 7.13106 19.4128 7.32892 19.26 7.46958L18.07 8.89358L14.021 13.7226C13.9501 13.8037 13.8558 13.8607 13.751 13.8856L11.651 14.3616C11.3755 14.3754 11.1356 14.1751 11.1 13.9016V11.7436C11.1071 11.6395 11.149 11.5409 11.219 11.4636L15.193 6.97058L16.557 5.34158C16.8268 4.98786 17.3204 4.89545 17.7 5.12758Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12.033 7.61865C12.4472 7.61865 12.783 7.28287 12.783 6.86865C12.783 6.45444 12.4472 6.11865 12.033 6.11865V7.61865ZM9.23301 6.86865V6.11865L9.23121 6.11865L9.23301 6.86865ZM5.50001 10.6187H6.25001L6.25001 10.617L5.50001 10.6187ZM5.50001 16.2437L6.25001 16.2453V16.2437H5.50001ZM9.23301 19.9937L9.23121 20.7437H9.23301V19.9937ZM14.833 19.9937V20.7437L14.8348 20.7437L14.833 19.9937ZM18.566 16.2437H17.816L17.816 16.2453L18.566 16.2437ZM19.316 12.4937C19.316 12.0794 18.9802 11.7437 18.566 11.7437C18.1518 11.7437 17.816 12.0794 17.816 12.4937H19.316ZM15.8863 6.68446C15.7282 6.30159 15.2897 6.11934 14.9068 6.2774C14.5239 6.43546 14.3417 6.87397 14.4998 7.25684L15.8863 6.68446ZM18.2319 9.62197C18.6363 9.53257 18.8917 9.13222 18.8023 8.72777C18.7129 8.32332 18.3126 8.06792 17.9081 8.15733L18.2319 9.62197ZM8.30001 16.4317C7.8858 16.4317 7.55001 16.7674 7.55001 17.1817C7.55001 17.5959 7.8858 17.9317 8.30001 17.9317V16.4317ZM15.767 17.9317C16.1812 17.9317 16.517 17.5959 16.517 17.1817C16.517 16.7674 16.1812 16.4317 15.767 16.4317V17.9317ZM12.033 6.11865H9.23301V7.61865H12.033V6.11865ZM9.23121 6.11865C6.75081 6.12461 4.7447 8.13986 4.75001 10.6203L6.25001 10.617C6.24647 8.96492 7.58269 7.62262 9.23481 7.61865L9.23121 6.11865ZM4.75001 10.6187V16.2437H6.25001V10.6187H4.75001ZM4.75001 16.242C4.7447 18.7224 6.75081 20.7377 9.23121 20.7437L9.23481 19.2437C7.58269 19.2397 6.24647 17.8974 6.25001 16.2453L4.75001 16.242ZM9.23301 20.7437H14.833V19.2437H9.23301V20.7437ZM14.8348 20.7437C17.3152 20.7377 19.3213 18.7224 19.316 16.242L17.816 16.2453C17.8195 17.8974 16.4833 19.2397 14.8312 19.2437L14.8348 20.7437ZM19.316 16.2437V12.4937H17.816V16.2437H19.316ZM14.4998 7.25684C14.6947 7.72897 15.0923 8.39815 15.6866 8.91521C16.2944 9.44412 17.1679 9.85718 18.2319 9.62197L17.9081 8.15733C17.4431 8.26012 17.0391 8.10369 16.6712 7.7836C16.2897 7.45165 16.0134 6.99233 15.8863 6.68446L14.4998 7.25684ZM8.30001 17.9317H15.767V16.4317H8.30001V17.9317Z" fill="#ffffff"></path></g></svg>
            Editar
            </button>
          </div>
        </div>
        </div>
        <div className="flex flex-col mb-2.5 items-center">
        <div className="w-5/6 h-full bg-white rounded-[10px] p-5 flex items-center justify-between pr-10">
        <div className="flex items-center">
  <div className="w-13 h-13 bg-purple-400/20 rounded-xl flex justify-center items-center">
  <svg  width="28px"  height="28px"  viewBox="0 0 48 48"  xmlns="http://www.w3.org/2000/svg"fill=""><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round"  strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path   fill="none"  stroke="#77008f"  strokeLinecap="round"  strokeLinejoin="round"  d="M24,12.41a7.26,7.26,0,0,0-7.26,7.26h0c0,5.68,5.56,12.53,7,14.21a.43.43,0,0,0,.62,0l.05,0c1.41-1.68,6.85-8.52,6.85-14.2A7.26,7.26,0,0,0,24,12.41Zm0,10a2.72,2.72,0,1,1,2.71-2.73v0A2.71,2.71,0,0,1,24,22.38Z" ></path> <path  fill="none"  stroke="#77008f"  strokeLinecap="round"  strokeLinejoin="round"  d="M22.2,4.86,6.69,11.25V27C6.69,35.44,24,43.5,24,43.5S41.31,35.44,41.31,27V11.25L25.8,4.86A4.68,4.68,0,0,0,22.2,4.86Z" ></path></g></svg>
              </div>
              <div className="pl-3">
              <h1 className="font-semibold text-[16px]">Preferências</h1>
              <p className="text-[14px]">Alterar alguma coisa "sujeito a mudanças"</p>
            </div>
            </div>
            <div>
              <button className="cursor-pointer w-30 h-8 bg-gray-300/40 text-[12px] font-normal rounded-[5px] flex items-center justify-center">
              Alterar senha
              <svg width="20px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(180)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M15 7L10 12L15 17" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
              </button>
            </div>
        </div>
        </div>
        <div className="flex flex-col mb-2.5 items-center">
        <div className="w-5/6 h-full bg-white rounded-[10px] p-5 flex items-center justify-between pr-10">
         <div className="flex items-center">
  <div className="w-13 h-13 bg-purple-400/20 rounded-xl flex justify-center items-center">
            <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xmlSpace="preserve" width="24px" height="24px" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="none" stroke="#77008f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M25,6.7c-3.4,0-6.6-1.4-9-3.7c-2.4,2.3-5.6,3.7-9,3.7C5.6,6.7,4.3,6.4,3,6c0,14,5.5,19.6,13,23c7.5-3.4,13-9,13-23C27.7,6.4,26.4,6.7,25,6.7z"></path><path fill="none" stroke="#77008f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M19,22h-6c-1.1,0-2-0.9-2-2v-4c0-1.1,0.9-2,2-2h6c1.1,0,2,0.9,2,2v4C21,21.1,20.1,22,19,22z"></path><path fill="none" stroke="#77008f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M20,14h-8v-2c0-2.2,1.8-4,4-4h0c2.2,0,4,1.8,4,4V14z"></path><line fill="none" stroke="#77008f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" x1="16" y1="17" x2="16" y2="19"></line></g></svg>
            </div>
            <div className="pl-3">
              <h1 className="font-semibold text-[15px]">Segurança</h1>
              <p className="text-[14px ]">Altere sua senha de acesso</p>
            </div>
            </div>
            <div>
              <button className="cursor-pointer w-30 h-8 bg-gray-300/40 text-[12px] font-normal rounded-[5px] flex items-center justify-center">
              Alterar senha
              <svg width="20px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(180)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M15 7L10 12L15 17" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
              </button>
            </div>
        </div>
        </div>
        <div className="flex flex-col mb-2.5 items-center">
        <div className="w-5/6 h-full bg-white rounded-[10px] flex items-center p-5 justify-between pr-10">
        <div className="flex items-center">
  <div className="w-13 h-13 bg-purple-400/20 rounded-xl flex justify-center items-center">
            <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fillRule="evenodd" clipRule="evenodd" d="M8.04283 5.1757C8.59546 4.75121 9.24946 4.43224 10.0136 4.23441C10.0046 4.15752 10 4.0793 10 4C10 2.89543 10.8955 2 12 2C13.1046 2 14 2.89543 14 4C14 4.0793 13.9954 4.15752 13.9864 4.23441C14.7506 4.43224 15.4046 4.75121 15.9572 5.1757C16.933 5.92519 17.4981 6.93095 17.8325 7.93362C18.1644 8.92891 18.2842 9.96595 18.3426 10.8395C18.3663 11.1941 18.3806 11.5351 18.3932 11.8357L18.4018 12.0385C18.4175 12.3994 18.433 12.6684 18.4596 12.8673C18.6553 14.329 18.8982 15.3543 19.2438 16.1741C19.5816 16.9754 20.0345 17.6202 20.7071 18.2929C20.9931 18.5789 21.0787 19.009 20.9239 19.3827C20.7691 19.7564 20.4045 20 20 20H13.7325C13.9026 20.2942 14 20.6357 14 21C14 22.1046 13.1046 23 12 23C10.8955 23 10 22.1046 10 21C10 20.6357 10.0974 20.2942 10.2676 20H4.00003C3.59557 20 3.23093 19.7564 3.07615 19.3827C2.92137 19.009 3.00692 18.5789 3.29292 18.2929C3.96694 17.6189 4.4186 16.9787 4.75553 16.1809C5.1004 15.3642 5.3434 14.3395 5.54043 12.8673C5.56706 12.6684 5.58255 12.3994 5.59827 12.0385L5.60687 11.8357C5.61945 11.5351 5.63371 11.1941 5.65744 10.8395C5.7159 9.96595 5.83561 8.92891 6.16756 7.93362C6.50196 6.93095 7.06705 5.92519 8.04283 5.1757ZM6.06869 18C6.26568 17.6741 6.44135 17.3298 6.59797 16.959C7.04284 15.9056 7.31562 14.6803 7.52276 13.1327C7.56305 12.8316 7.58113 12.4756 7.59638 12.1255L7.60555 11.9095C7.61808 11.6105 7.63109 11.3002 7.65298 10.973C7.70745 10.159 7.81312 9.32109 8.06482 8.56638C8.31407 7.81905 8.6909 7.19981 9.26113 6.7618C9.82482 6.32883 10.6723 6 12 6C13.3278 6 14.1752 6.32883 14.7389 6.7618C15.3092 7.19981 15.686 7.81905 15.9352 8.56638C16.1869 9.32109 16.2926 10.159 16.3471 10.973C16.369 11.3002 16.382 11.6105 16.3945 11.9095L16.3945 11.9095L16.3945 11.9096L16.4037 12.1255C16.4189 12.4756 16.437 12.8316 16.4773 13.1327C16.6832 14.671 16.956 15.8957 17.4008 16.9509C17.5583 17.3244 17.735 17.6714 17.9334 18H6.06869Z" fill="#77008f"></path></g></svg>
            </div>
            <div className="pl-3">
              <h1 className="font-semibold text-[15px]">Notificações</h1>
              <p className="text-[14px]">Gerencie as notificações do sistema</p>
            </div>
            </div>
            <input
  id="checkboxInput"
  type="checkbox"
  className="peer hidden"
/>

<label
  htmlFor="checkboxInput"
  className="
    relative flex h-8.5 w-15.5 cursor-pointer
    items-center justify-center rounded-[20px]
    bg-[#525252] transition duration-200

    after:absolute
    after:left-2.25
    after:h-3.5
    after:w-3.5
    after:rounded-full
    after:border-[7px]
    after:border-white
    after:bg-transparent
    after:shadow-[7px_4px_9px_rgba(8,8,8,0.26)]
    after:transition-transform
    after:duration-200

    peer-checked:bg-purple-500
    peer-checked:after:translate-x-7.25
    peer-checked:after:bg-white
  "
  ></label>
        </div>
        </div>
        <div className="flex flex-col mb-2.5 items-center">
        <div className="w-5/6 h-full bg-white rounded-[10px] flex p-5 items-center justify-between pr-10">
        <div className="flex items-center">
  <div className="w-13 h-13 bg-purple-400/20 rounded-xl flex justify-center items-center">
            <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path opacity="0.4" d="M10.9707 2H8.9707C3.9707 2 1.9707 4 1.9707 9V15C1.9707 20 3.9707 22 8.9707 22H14.9707C19.9707 22 21.9707 20 21.9707 15V13" stroke="#77008f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M21.8795 3.56022C20.6495 6.63022 17.5595 10.8102 14.9795 12.8802L13.3995 14.1402C13.1995 14.2902 12.9995 14.4102 12.7695 14.5002C12.7695 14.3502 12.7595 14.2002 12.7395 14.0402C12.6495 13.3702 12.3495 12.7402 11.8095 12.2102C11.2595 11.6602 10.5995 11.3502 9.91945 11.2602C9.75945 11.2502 9.59945 11.2402 9.43945 11.2502C9.52945 11.0002 9.65945 10.7702 9.82945 10.5802L11.0895 9.00022C13.1595 6.42022 17.3495 3.31022 20.4095 2.08022C20.8795 1.90022 21.3395 2.04022 21.6295 2.33022C21.9295 2.63022 22.0695 3.09022 21.8795 3.56022Z" stroke="#77008f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12.7801 14.49C12.7801 15.37 12.4401 16.21 11.8101 16.85C11.3201 17.34 10.6601 17.68 9.87009 17.78L7.90009 17.99C6.83009 18.11 5.91009 17.2 6.03009 16.11L6.24009 14.14C6.43009 12.39 7.89009 11.27 9.45009 11.24C9.61009 11.23 9.77009 11.24 9.93009 11.25C10.6101 11.34 11.2701 11.65 11.8201 12.2C12.3601 12.74 12.6601 13.36 12.7501 14.03C12.7701 14.19 12.7801 14.35 12.7801 14.49Z" stroke="#77008f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity="0.4" d="M15.8193 11.9799C15.8193 9.88994 14.1293 8.18994 12.0293 8.18994" stroke="#77008f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
            </div>
            <div className="pl-3">
              <h1 className="font-semibold text-[15px]">Aparência</h1>
              <p className="text-[14px]">Escolha o tema da interface</p>
            </div>
            </div>
            <div>
              <select className="gap-2 w-30 p-1 h-7 bg-gray-300/40 text-[12px] font-normal rounded-[5px]">
              <option value="">
              Tema claro
              </option>

              <option value="">
              Tema escuro
              </option>
              </select>
            </div>
        </div>
        </div>
        <div className="flex flex-col items-center">
        <div className="w-5/6 h-full bg-white rounded-[10px] p-5 flex items-center justify-between pr-10">
        <div className="flex items-center">
  <div className="w-13 h-13 bg-purple-400/20 rounded-xl flex justify-center items-center">
            <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><g clipPath="url(#clip0_429_11160)"><circle cx="12" cy="11.9999" r="9" stroke="#77008f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></circle><rect x="12" y="8" width="0.01" height="0.01" stroke="#77008f" strokeWidth="3.75" strokeLinejoin="round"></rect><path d="M12 12V16" stroke="#77008f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path></g><defs><clipPath id="clip0_429_11160"><rect width="24" height="24" fill="white"></rect></clipPath></defs></g></svg>
            </div>
            <div className="pl-3">
              <h1 className="font-semibold text-[15px]">Sobre o sistema</h1>
              <p className="text-[14px]">Informações da versão e licenças</p>
            </div>
            </div>
            <div>
              <button className="cursor-pointer w-30 h-9 bg-gray-300/40 text-[12px] font-normal rounded-[5px] flex items-center justify-center">
              Ver informações
              </button>
            </div>
        </div>
        </div>
      </main>
    </>
  );
}