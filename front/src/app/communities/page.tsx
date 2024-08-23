// コミュニティ一覧ページ

"use client";

import { useState, useEffect, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { getUserSession } from "@/service/supabase/auth/getUserSession";
import { getCommunity } from "@/service/supabase/get/getCommunity";
import { CommunityType } from "@/constants/communityType";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const CommunitiesPage: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [display, setDisplay] = useState<CommunityType[]>([]);
    const initializationDone = useRef(false);

    useEffect(() => {
        if (initializationDone.current) return;
        initializationDone.current = true;

        const initializeAuth = async () => {
            const initialSession = await getUserSession();
            setSession(initialSession);
            const community = await getCommunity(0);
            setDisplay(community);
            console.log("communityは、->", community);
        };

        initializeAuth();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar session={session} />
            <main className="flex-grow bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {session ? (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4">
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                    コミュニティ一覧
                                </h1>
                            </div>
                            <div className="border-t border-gray-200">
                                {display.map((community) => (
                                    <div
                                        key={community.community_id}
                                        className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                                    >
                                        <div className="flex-1 pr-4">
                                            <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                                『{community.name}』
                                            </h2>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {community.detail}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/community/${community.community_id}`}
                                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-md whitespace-nowrap"
                                        >
                                            詳細
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <p className="text-lg font-medium text-gray-900">
                                ログインしていません
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CommunitiesPage;
