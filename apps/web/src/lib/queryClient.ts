import {QueryClient} from "@tanstack/react-query";

//cau hinh cho TanStack Query
export const queryClient = new QueryClient({
    defaultOptions: {
        queries:{
            //du lieu xem la moi trong vong 1 phut, khong fetch lai khi chuyen tab
            staleTime: 1000 * 60 *1,
            //du lieu trong Ram cache trong 5 phut truoc khi don rac 
            gcTime: 1000 * 60 * 5,
            //tu dong thu lai toi da 1 lan neu API bi loi
            retry: 1,
            // tat tu dong fetch API khi user chuyen tab ra ngoai roi tab lai
            refetchOnWindowFocus: false,

        },
    },
})