import { useEffect, useState } from "react";
import TabSwitcher from "components/core-ui/tab-switcher/TabSwitcher";
import Categories from "./categories/Categories";
import Questions from "./questions/Questions";
import { useHeaderProps } from "components/core/use-header-props";
import { useTranslation } from "react-i18next";

function QuestionsNCategories() {
    const [selectedTab, setSelectedTab] = useState(0);
    const { setTitle } = useHeaderProps();
    const { t } = useTranslation();

    useEffect(() => {
        setTitle(t('Question & Category Management')), [setTitle, t];
    }, [setTitle, t]);

    const tabsLabel = [
        {
            label: t("Categories")
        },
        {
            label: t("Questions")
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