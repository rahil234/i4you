'use client';

import {useEffect} from "react";
import {useInteractionStore} from "@/store/interaction-store";
import {useMatchesStore} from "@/store/matches-store";

export function StoreInitializer() {
    const {initial: InteractionStoreInitial} = useInteractionStore();
    const {initial: MatchStoreInitial} = useMatchesStore();

    useEffect(() => {
        InteractionStoreInitial()
        MatchStoreInitial()
    }, []);
    return null;
}
