import { useEffect, useState } from "react";
import TabSwitcher from "components/core-ui/tab-switcher/TabSwitcher";
import Categories from "./categories/Categories";
import Questions from "./questions/Questions";
import { useHeaderProps } from "components/core/use-header-props";

function QuestionsNCategories() {
    const [selectedTab, setSelectedTab] = useState(0);
    const { setTitle } = useHeaderProps();

    useEffect(() => {
        setTitle('Questions & Categories');
    }, []);

    const tabsLabel = [
        {
            label: "Categories"
        },
        {
            label: "Questions"
        }
    ]

    return (
        <section>
            <TabSwitcher selectedTab={selectedTab} onSelectTab={setSelectedTab} tabs={tabsLabel} />
            <div>
                {selectedTab === 0 ? (
                    <Categories />
                ) : (
                    <Questions />
                )}
            </div>
        </section>
    )
}

export default QuestionsNCategories;