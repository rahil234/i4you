'use client';

import {useEffect} from "react";
import {useInteractionStore} from "@/store/interaction-store";
import {useMatchStore} from "@/store/match-store";

export function StoreInitializer() {
    const {initial: InteractionStoreInitial} = useInteractionStore();
    const {initial: MatchStoreInitial} = useMatchStore();

    useEffect(() => {
        InteractionStoreInitial()
        MatchStoreInitial()
    }, []);
    return null;
}
