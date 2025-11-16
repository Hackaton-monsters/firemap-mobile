import { ReactNode, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AnimatedTabs } from '../AnimatedTabs/AnimatedTabs';

export type Tab = {
  id: string;
  label: string;
  icon: string;
};

type IProps = {
  tabs: Tab[];
  renderContent: (activeTab: string) => ReactNode;
  initialTab?: string;
};

export const TabbedContent = ({ tabs, renderContent, initialTab }: IProps) => {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0]?.id || '');

  return (
    <>
      <AnimatedTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <View style={styles.content}>
        {renderContent(activeTab)}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
