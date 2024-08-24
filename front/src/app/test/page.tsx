'use client';

import { useState, useEffect, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { getUserSession } from '@/service/supabase/auth/getUserSession';
import { getCommunity } from '@/service/supabase/get/getCommunity';
import { addUserCommunity } from '@/service/supabase/updates/addUserCommunity';
import { getCommunityMembers } from '@/service/supabase/get/getCommunityMembers';
import { getUserContribution } from '@/service/supabase/get/getUserContribution';
import { getCommunityContribution } from '@/service/supabase/get/getCommunityContribution';

export default function Test() {
    const [session, setSession] = useState<Session | null>(null);
    const initializationDone = useRef(false);

    useEffect(() => {
        //デバックモードだと２回呼ばれる対策
        if (initializationDone.current) return;
        initializationDone.current = true;
        async function initializeAuth() {
            const initialSession = await getUserSession();
            setSession(initialSession);
            //コミュニティ一覧取得
            const community = await getCommunity(0);
            console.log(community);
            //入りたいコミュニティのメンバー取得
            const communityMember = await getCommunityMembers(community[0].community_id);
            const communityContributionInfo= await getCommunityContribution(community[0].community_id);
            console.log(communityContributionInfo);
            //メンバー上限に達していなければ参加
            if (communityMember.length < community[0].member_limits) {
                //addUserCommunity(community[0].community_id, "hello"); //引数　入るコミュニティID,　個人が特定されないニックネーム
            }

            console.log(communityMember);
        }


        initializeAuth();
    }, []);

    useEffect(() => {
        if (session) {
            const fetchUserContribution = async () => {
                const userContributionInfo = await getUserContribution(session.user.id);
                console.log(userContributionInfo);
            };

            fetchUserContribution();
        }
    }, [session]);

    if (session) {

        return (
            <div>
                <div>User Metadata: <pre>{JSON.stringify(session, null, 2)}</pre></div>
            </div>
        );
    } else {
        return <div>ログインしていない</div>
    }
}